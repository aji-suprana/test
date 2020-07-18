const fb = require('../repository/facebook-api')
const debug = require('../services/debug')
module.exports=async (req,res,next)=>{
  cart = await Cart.findOne({
    where: {
      buyer_fb_id: req.body.fb_id,
      session_id: req.body.session_id
    }, include: {
      model: Checkout
    }
  })
  debug.logData("cart created", cart);
  

  return res.status(200).json({
    status: 'success',
    cart: cart
    
  });
}