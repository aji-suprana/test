var debug = require('../services/debug')
var lodash = require('lodash');
var library = {}

library.generate_SystemMessage=(message) =>{
  debug.logData("BASE_LINK_CART_FRONT_END",process.env.BASE_LINK_CART_FRONT_END);
  var msg ={
    text: "```" + message+"```"
  }

  return msg;
}

library.generate_sessionExpired=(session_id) =>{
  debug.logData("BASE_LINK_CART_FRONT_END",process.env.BASE_LINK_CART_FRONT_END);
  var msg ={
    text: "```Influencer's Live Video is not attached to Upmesh Session```"
  }

  return msg;
}

library.generate_StockNotSufficient=(productName) =>{
  var msg = {
    "text":' *'+ lodash.toUpper(productName) +'*' + " Stock Not Sufficient" ,
  }

  return msg;
}

library.generate_ProductAdded=(quantity, productName,cart_id) =>{
debug.logData("BASE_LINK_CART_FRONT_END",process.env.BASE_LINK_CART_FRONT_END);

  var msg ={
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":quantity + 'x *'+ lodash.toUpper(productName) +'* ' + " has been added",
        "buttons":[
          {
            "type":"web_url",
            "url":`${process.env.BASE_LINK_CART_FRONT_END}/buy/${cart_id}`,
            "title":"Visit Cart"
          }
        ]
      }
    }
  }

  return msg;
}

module.exports = library;