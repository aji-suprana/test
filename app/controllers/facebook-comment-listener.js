const EventSource = require('eventsource');
const debug = require('../services/debug')
const parseComment = require('../services/comment-parser').parseComment;
const facebookAPI = require('../repository/facebook-api');
const getUserId = require('../services/get-user-id').getUserId;
const flaverr = require('flaverr');
const messageFormat  = require('../services/facebook-message-format')
const cartRepo = require('../repository/cart');
module.exports = async (req, res, next) => {
  try{
    const eventSourceInitDict = {
      https: {
          rejectUnauthorized: false
      }
    }
  
    const es = new EventSource(`${process.env.FB_SSE_HOST}/${req.params.video_id}/live_comments?access_token=${req.user.accessToken}&comment_rate=one_hundred_per_second&fields=from{name,id},message`,
        eventSourceInitDict);
  
    es.onerror = async (err) => {
        if (err) {
            if (err.status === 401 || err.status === 403) {
                throw flaverr('E_NOT_AUTHORIZED', Error(`You are not authorized`));
            }
        debug.logData("facebok Error",err);
  
        }
    }
  
    es.onopen = async (msg) => {
        debug.logData("facebok Open",msg);
    }
  
    es.onmessage = async (msg) => {
      await onMessage(msg,req,res);
    }
      return res.status(200).json({
        status: 'success',
        message: "testing"
    });
  }
  catch (err) {
    debug.logError(err);
    return res.status(401).json({
        status: 'failed',
        message: err.message
    });
  }
}

////////////////////////////////////////////////////////////////////////////
//EVENTS
////////////////////////////////////////////////////////////////////////////
////////////////////////////////
// onMessage
// Event Handler for receiving fb message
////////////////////////////////
async function onMessage(msg,req)
{
  try
  {
    debug.logHeader("message received")
    debug.logData("msg",msg);
    let comment = JSON.parse(msg.data);
    let message = comment.message;
    debug.logData("facebok Message",comment);

    debug.logHeader("checking seller's comment");
    console.log(`fb_id from comment : ${comment.from.id}`);
    console.log(`fb_id from token : ${req.user.fbId}`);
    let test = (comment.from.id === req.user.fbId);
    console.log(`checking result [true/false] : ${test}`);

    // getting seller recepient id and handling seller buy their own page
    if (comment.from.id === req.user.fbId) 
    {
      comment.message = "hi seller";
    }

    // getting seller's session
    const sellerSession = await Session
    .findOne({
        where: {
            user_id: req.user.userData.id,
            is_expired: false
        }
    });
    debug.logData("findOne", sellerSession.toJSON());

    
    //TODO send message to seller notifying no sellerSession
    ErrorCondition(!sellerSession,'E_NOT_FOUND',`seller by user id ${req.user.userData.id} is doesn't have session or session is expired`);
    
  
    debug.logHeader('parsingComment');
    const parsedMessage = parseComment(message,comment.id,comment.from);
    debug.logData(parsedMessage);
  
    //Process Parsed Message
    if(parsedMessage.status == 'OK')
    {
      debug.logData("comment parsing", parsedMessage);
      ProcessMessage(parsedMessage,sellerSession,comment,req);
    }
    else
    {
      debug.logError("comment parsing")
    }
  }catch(err){
    debug.logError(err);
  }
    
  

}

///////////////////////////////////////////////////////////////////////////
//Helper
////////////////////////////////////////////////////////////////////////////
function ErrorCondition(condition, errorCode ,errorMessage, callBack)
{
  if (condition) 
  {
    if(callBack)
    {
      callBack();
    }
    debug.logError(errorMessage);
    throw flaverr(errorCode,Error(errorMessage));
  }
}

async function ProcessMessage(parsedMessage,sellerSession,comment,req)
{
  var buyer_fb_id = comment.from.id;

  const resultTrans = await sequelize.transaction(async (t) => {
    var sellerPage = await User_pages.findOne({
      where: {
          user_fb_id: req.user.fbId,
          page_fb_id: req.user.pageId
      }
    });
  
    if (sellerPage === null) {
      const getSellerRecepientId = await getUserId({
        accessToken: req.user.pageToken,
        message: "Connecting to Upmesh ...",
        comment_id: comment.id
      });
  
      sellerPage = await User_pages.create({
          user_fb_id: req.user.fbId,
          page_fb_id: req.user.pageId,
          seller_recipient_id: getSellerRecepientId.data.recipient_id
      })
    }

    debug.logHeader("Find Session by id")
    const session = await Session.findOne({
        where: {
            id: sellerSession.id
        },
        transaction: t
    });

    ErrorCondition(!session,'E_NOT_FOUND',`session not found`,async ()=>{
      debug.logHeader("Replying Comment")
      const send2 = await facebookAPI.replyPurchaseComment({
        accessToken: req.user.pageToken,
        comment_id: comment.id,
        message : messageFormat.generate_SystemMessage("Current Session is not connected to Upmesh Live")
      });
    });
    
    //Check Product
    const product = await Product.findOne({
        where: {
            product_code: parsedMessage.product,
            user_id : session.user_id
        },
        transaction: t
    });

    ErrorCondition(!product,'E_NOT_FOUND',`${parsedMessage.product} is does not exist`,async ()=>{
      debug.logHeader("Replying Comment")
      const send2 = await facebookAPI.replyPurchaseComment({
        accessToken: req.user.pageToken,
        comment_id: comment.id,
        message : messageFormat.generate_SystemMessage(parsedMessage.product + " does not exist")
      });
    });
    
    debug.logData("product",product.toJSON());

    const sessionProduct = await SessionProduct
    .findOne({
      where : {
        product_id : product.id,
        session_id : session.id
      }
    })

    debug.logData("sessionProduct",sessionProduct.toJSON());

    ErrorCondition(!sessionProduct,'E_NOT_FOUND',` ${product.product_id} product is not registered in current session`,
    async ()=>{
      debug.logHeader("Replying Comment")
      const send2 = await facebookAPI.replyPurchaseComment({
        accessToken: req.user.pageToken,
        comment_id: comment.id,
        message : messageFormat.generate_SystemMessage(product.product_name + " is not registered in current session")
      });
    });

    ErrorCondition(parsedMessage.count > product.product_stock,'E_LOW_STOCK',`product by name \' ${product.product_name} \' has insufficient stock`,
    async ()=>{
      debug.logHeader("Replying Comment")
      const send2 = await facebookAPI.replyPurchaseComment({
        accessToken: req.user.pageToken,
        comment_id: comment.id,
        message : messageFormat.generate_StockNotSufficient(product.product_name)
      });
    });

    var cart = await Cart.findAll({
      limit: 1,
      where: {
          buyer_fb_id: comment.from.id,
          session_id: session.id
      },
      order: [['created_at', 'DESC']],
      include: {
          model: Checkout
      },
      transaction: t
    });
    cart = cart[0]
    if(cart)
    {
      debug.logData("latest cart",cart.toJSON());
    }

    if(!cart || (cart && cart.Checkout))
    { 
      var cartData = {
        session_id: session.id,
        buyer_fb_id : buyer_fb_id,
        buyer_recipient_id : null,
        seller_recipient_id : sellerPage.seller_recepient_id,
        page_id : sellerPage.page_fb_id,
        name : comment.from.name
      }
      cart = await cartRepo.create(cartData);
    }

    debug.logData('created cart', cart.toJSON());
    
    const cartProduct = await CartProduct.findOne({
      where: {
          cart_id: cart.id,
          product_id: product.id
      },
      transaction: t
    });
  //if fbId and pageId Included in request
  ErrorCondition(!req.user.fbId || !req.user.pageId,'INVALID_AutH',`req.user is inValid`,
    async ()=>{
      debug.logHeader("Replying Comment")
      const send2 = await facebookAPI.replyPurchaseComment({
        accessToken: req.user.pageToken,
        comment_id: comment.id,
        message : messageFormat.generate_SystemMessage("ERROR")
      });
    }
  )
 
  let count = parsedMessage.count;
  debug.logData("purchaseCount", count);

  if (cartProduct) {
    count = (cartProduct.quantity + count) < 1 ? 0 : (cartProduct.quantity + count);
    await CartProduct.update({
        quantity: count
    }, {
        where: {
            id: cartProduct.id
        },
        transaction: t
    });
  } 
  else {
    await CartProduct.create({
        cart_id: cart.id,
        product_id: product.id,
        quantity: count
    }, { transaction: t });
  }

  product.product_stock -= parsedMessage.count;
  product.product_sold += parsedMessage.count;
  await product.save();

  debug.logData("product_stock",product.product_stock);
  debug.logData("product_sold",product.product_sold);

  await facebookAPI.replyPurchaseComment({
    accessToken: req.user.pageToken,
    comment_id: comment.id,
    message : messageFormat.generate_ProductAdded(parsedMessage.count,product.product_name,cart.id)
  })
  
    // debug.logHeader("Replying Comment")
    // const send = await facebookAPI.replyPurchaseComment({
    //   accessToken: req.user.pageToken,
    //   comment_id: comment.id,
    //   message : messageFormat.generate_ProductAdded(product.product_name,"asdfasdfasdf")
    // });

  

    // const send1 = await facebookAPI.replyPurchaseComment({
    //   accessToken: req.user.pageToken,
    //   comment_id: comment.id,
    //   message : messageFormat.generate_cartCreationMessage(product.product_name,"asdfasdfasdf")
    // });
  })
}