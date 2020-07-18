const axios = require('axios');
module.exports.getUserId = async (data) => {
    try {
        const send = (await axios.post(`${process.env.FB_HOST}/me/messages?access_token=${data.accessToken}`, {
            recipient: {
                comment_id: data.comment_id
            },
            message: {
                text: data.message
            }
        })).data;

        console.log(send);
        return Promise.resolve({ success: true, data: send });
    }
    catch (err) {
        console.log(err.message)
        return Promise.reject({ success: false })
    }
}