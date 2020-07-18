const axios = require('axios');
const jwt = require('jsonwebtoken');
const EventSource = require('eventsource');
const log = require('../services/debug')
const encryption = require('../services/encryption');
const parseComment = require('../services/comment-parser').parseComment;
const sendMessage = require('../services/send-message').sendMessage;
const replyComment = require('../services/reply-comment').replyComment;
const getUserId = require('../services/get-user-id').getUserId;
const generateOrderId = require('../services/generate-order-id');
const debug = require('../services/debug')
const success = async (req, res, next) => {
    try {
        if (req.user) {
            const userExist = await User.findOne({
                where: {
                    email: req.user.userData.email
                }
            });

            let isNewUser = true;
            if (userExist) isNewUser = false;

            const [user, created] = await User.findOrCreate({
                where: {
                    email: req.user.userData.email
                },
                defaults: {
                    email: req.user.userData.email,
                    first_name: req.user.userData.first_name,
                    last_name: req.user.userData.last_name,
                    fb_id: req.user.userData.id
                }
            });

            req.user.fbId = req.user.userData.id;
            req.user.userData.id = user.toJSON().id;

            let token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '90d' });
            console.log(token)
            token = encryption.encrypt(token);
            return res.status(200).json({
                status: 'success',
                token: token,
                flag: {
                    is_new_user: isNewUser
                }
            });
        }

        throw new Error('failed to authenticate');
    }
    catch (err) {
        return res.status(401).json({
            status: 'failed',
            message: err.message
        });
    }
}

const getPages = async (req, res, next) => {
    log.logHeader("Get Pages")
    try {
        let pages = (await axios.get(`${process.env.FB_HOST}/me/accounts?`, {
            params: {
                access_token: req.user.accessToken
            }
        })).data;
        log.log("pages response", pages);
        if (pages.data.length < 1) throw new Error('page not found');

        pages.data = pages.data.map((p) => {
            return {
                id: p.id,
                name: p.name
            }
        });

        return res.status(200).json({
            status: 'success',
            pages
        });
    }
    catch (err) {
        return res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
}

const setPageToken = async (req, res, next) => {
    try {
        let pages = (await axios.get(`${process.env.FB_HOST}/me/accounts?`, {
            params: {
                access_token: req.user.accessToken
            }
        })).data;

        if (pages.data.length < 1) throw new Error('page not found');

        let index = _.findIndex(pages.data, { 'id': req.body.page_id });

        if (index === -1) throw new Error('page not found');

        let existPage = await Page.findOrCreate({
            where: {
                fb_page_id: req.body.page_id
            },
            defaults: {
                name: pages.data[index].name,
                fb_page_id: req.body.page_id,
                page_token: encryption.encrypt(pages.data[index].access_token).data,
            }
        })

        req.user.pageToken = pages.data[index].access_token;
        req.user.pageId = pages.data[index].id;

        let token = jwt.sign(req.user, process.env.JWT_SECRET);
        token = encryption.encrypt(token);

        return res.status(200).json({
            status: 'success',
            token: token
        });
    }
    catch (err) {
        console.log(err)
        return res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
}

const getLiveVideos = async (req, res, next) => {
    try {
        if (!req.user.pageId) throw new Error('please set page token first!');

        let type = req.user.pageId;
        let token = req.user.pageToken;

        // let type = 'me';
        // let token = req.user.accessToken;
        // if (req.query.type) {
        //     if (req.query.type === 'page') {
        //         type = req.user.pageId;
        //         token = req.user.pageToken;
        //     }
        // }

        const lives = (await axios.get(`${process.env.FB_HOST}/${type}/live_videos?status=LIVE_NOW`, {
            params: {
                access_token: token
            }
        })).data;

        if (lives.data.length < 1) throw new Error('live video not found');

        return res.status(200).json({
            status: 'success',
            lives
        });
    }
    catch (err) {
      debug.logError(err);
        return res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
}

const getLiveComments = async (req, res, next) => {
    try {
        const lives = (await axios.get(`${process.env.FB_HOST}/${req.params.video_id}/comments`, {
            params: {
                access_token: req.user.accessToken
            }
        })).data;

        return res.status(200).json({
            status: 'success',
            lives
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'failed to retrieve data'
        });
    }
}

const getLiveVideoById = async (req, res, next) => {
    try {
        const lives = (await axios.get(`${process.env.FB_HOST}/${req.params.video_id}`, {
            params: {
                access_token: req.user.accessToken,
                limit: req.query.limit || 50
            }
        })).data;

        return res.status(200).json({
            status: 'success',
            lives
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'failed to retrieve data'
        });
    }
}

const sendMessageFB = async (req, res, next) => {
    try {
        const data = {
            accessToken: req.user.pageToken,
            message: req.body.message,
            recipient_id: req.body.recipient_id
        }

        const send = await sendMessage(data);

        return res.status(200).json(send);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const getUserIdFB = async (req, res, next) => {
    try {
        const data = {
            accessToken: req.user.pageToken,
            message: req.body.message,
            comment_id: req.body.comment_id
        }

        const send = await getUserId(data);

        return res.status(200).json(send);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

module.exports = {
    success,
    getLiveVideos,
    getLiveVideoById,
    getLiveComments,
    getPages,
    setPageToken,
    sendMessageFB,
    getUserIdFB
}