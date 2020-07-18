const flaverr = require('flaverr');
const debug =require('../services/debug');
const generateOrderId = require('../services/generate-order-id');
const cartConfig = require('../../config/cartStatus');
const lodash = require('lodash');
const dayjs = require('dayjs');
var library = {}

////////////////////////////////////////////////////////
// create
library.create=async function(data)
{
  debug.logHeader("CREATING CART")
  const session = await Session.findOne({
      where: {
          id: data.session_id
      },
  });

  debug.log("check if session exist");
  if (!session) throw flaverr('E_NOT_FOUND', Error(`session with id ${data.session_id} is not exist`));

  const order_id = generateOrderId();
  const expiry_date = dayjs().add('15', 'day');
  const cart = {
      user_id: session.user_id,
      session_id: data.session_id,
      order_id: order_id,
      buyer_fb_id : data.buyer_fb_id,
      buyer_recipient_id : data.buyer_recepient_id,
      cart_status : 'Active',
      seller_recipient_id : data.seller_recepient_id,
      page_id : data.page_id,
      name : data.name,
      expiry_date: expiry_date
  }

  debug.logData("cart created", cart);

  const save = await Cart.create(cart);

  return save;
}





////////////////////////////////////////////////////////////////////////////////////////////
// HELPERS
library.ValidateCartStatus = function(cartStatus)
{
    var response = {}
    response.status = 'SUCCESS';
    
    var valid = false;
    cartConfig.forEach((value,index)=>{
        if(value == cartStatus)
            valid = true;
    })

    if(valid)
        return response;
    else
    {
        response.status = 'INVALID'
        response.body = `${cartStatus} is not registered`
        return response
    }
}

library.GetCartStatusObject = function()
{
    var cartStatus = {}
    
    cartConfig.forEach((value,index)=>{
        cartStatus[value] = index;
    })

    return cartStatus;
}

library.GetCartStatusArray = function()
{
    return cartConfig;
}

module.exports = library;