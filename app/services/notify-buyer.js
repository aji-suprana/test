const axios = require('axios');
module.exports.notifyBuyer = async (data) => {
    try {
        const send = (await axios.post(`${process.env.FB_HOST}/me/messages?access_token=${data.accessToken}`, {
            recipient: {
                id: data.recipient_id
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: "Upmesh",
                                image_url: process.env.LOGO_UPMESH,
                                subtitle: "Checkout successfully",
                                buttons: [
                                    {
                                        "type": "web_url",
                                        "url": data.url,
                                        "title": "View Checkout"
                                    }
                                ]
                            }
                        ]
                    }
                }
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