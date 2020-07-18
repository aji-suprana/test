const axios = require('axios');
const debug = require('../services/debug')
const lodash = require('lodash');
const flaverr = require('flaverr');
const messageForm = require('../services/facebook-message-format');
const library = {}

library.sendMessage= async(data,token)=>{
  try {
    debug.logData("package",data);
    debug.logData("token",token);
      const send = (await axios.post(`${process.env.FB_HOST}/me/messages?access_token=${token}`, data)).data;

      debug.logData("sent",send);
      return Promise.resolve({ success: true, data: send });
  }
  catch (err) {
      console.log(err.message)
      return Promise.reject({ success: false })
  }
}

library.replyPurchaseComment = async(data)=>{
  try{
    if(!lodash.has(data,"accessToken")   ||
    !lodash.has(data,"comment_id") ||
    !lodash.has(data,"message")) 
    {
     throw flaverr("INVALID_DATA", "param data is incomplete");
    }

    if(!data.comment_id)
    {
      throw flaverr("INVALID_DATA", "param data is incomplete");
    }
    debug.logData("messageData",data);

    var package =  {
      recipient : {
        comment_id: data.comment_id,
      },
      message : data.message
    }

    const send = await library.sendMessage(package, data.accessToken)

    return send;
  }catch(err){
    debug.logError(err);
  }
}

library.sendAddItemMessage = async(data)=>{
}




module.exports=library;