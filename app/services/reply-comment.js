const axios = require('axios');
const log = require('../services/debug')

module.exports.replyComment = async (data) => {
    try {
        log.logHeader("*********** Call Facebook API  me/messages? ***********")
        const send = (await axios.post(`${process.env.FB_HOST}/me/messages?access_token=${data.accessToken}`, {
            recipient: {
                comment_id: data.comment_id
            },
            message: {
                // text: data.message,
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: "Upmesh",
                                image_url: process.env.LOGO_UPMESH,
                                subtitle: "Cart created successfully",
                                buttons: [
                                    {
                                        "type": "web_url",
                                        "url": data.url,
                                        "title": "View Cart"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        })).data;
        log.message(send);
        console.log(send);
        return Promise.resolve({ success: true, data: send });
    }
    catch (err) {
        log.message("ERROR OCCURED AT reply-comment.js")
        console.log(err.message)
        return Promise.reject({ success: false })
    }
}