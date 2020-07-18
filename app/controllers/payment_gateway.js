const crypto = require('crypto');
const flaverr = require('flaverr');
const debug = require("../services/debug")

const axios = require('axios').default;
const FormData = require('form-data');

const pad = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

var library = {}

library.signPaymentToken = async (req, res) => {
  debug.logHeader("send Payment Request");
  try {
    let cart = await Cart.findOne({
      where: {
          id: req.body.cart_id
      },
      include: [
        {
            model: Checkout
        }, 
        {
            model: Session,
            attributes: ['cart_editable']
        },
        {
          model: User,
        },
      ]
    })

    const secretKey = "E8838C90AEF599BCCC8CBF2323B09DA0F796238912A3D0B3B26A5B98C6CB0EFF"//process.env.PAYMENT_GATEWAY_SECRET;

   /* PAYMENT_GATEWAY_SECRET=E8838C90AEF599BCCC8CBF2323B09DA0F796238912A3D0B3B26A5B98C6CB0EFF
PAYMENT_GATEWAY_VERSION=8.5
PAYMENT_GATEWAY_MERCHANT_ID=702702000000526
PAYMENT_GATEWAY_REDIRECT_URL=http://localhost:1335/payment_gateway
PAYMENT_GATEWAY_CURRENCY=702
PAYMENT_GATEWAY_SECRET_KEY=E8838C90AEF599BCCC8CBF2323B09DA0F796238912A3D0B3B26A5B98C6CB0EFF*/
    if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart does not exist`))
    if (!cart.order_id) throw flaverr('E_NOT_FOUND', Error(`invalid_order_id in card`))


    debug.logData('userId',cart.User.id);
    let business = await Business.findOne({
      where: {
        user_id : cart.User.id
      }
    })

    if (!business) throw flaverr('E_NOT_FOUND', Error(`business profile have not been created`))
    if (!business.merchant_id) throw flaverr('E_NOT_FOUND', Error(`invalid merchant_id`))


    debug.logData('found business', business.toJSON());
    const checkDate = Date.now() > cart.expiry_date;
    if (checkDate) {
      throw flaverr('E_CART_EXPIRED', Error('cart is expired'));
    }

    const version = req.body.version;
    const merchant_id = business.merchant_id;
    const result_url_1 = req.body.result_url_1
    const result_url_2 = req.body.result_url_2
    const currency =req.body.currency;
    const amount = req.body.amount//pad((parseFloat(req.body.amount) * 100).toString(), 12);
    const order_id = cart.order_id;
    const payment_description = req.body.payment_description;
    const user_defined_1 = cart.id;

    var checkHashStr = `${version}${merchant_id}${payment_description}${order_id}${currency}${amount}${user_defined_1}${result_url_1}${result_url_2}`;
    debug.logData("version",version);
    debug.logData("secretKey",secretKey);
    debug.logData("merchant_id",merchant_id);
    debug.logData("result_url_1",result_url_1);
    debug.logData("currency",currency);

    var hash_value = crypto.createHmac('sha256', secretKey).update(checkHashStr).digest('hex');
    const details = {
      version,
      merchant_id,
      currency,
      result_url_1,
      result_url_2,
      hash_value,
      user_defined_1,
      order_id,
      amount,
      payment_description,
    };

    debug.logData('details',details);

    return res.status(200).json({
      status: 'success',
      hash : details
    });
  }catch (err) {
    debug.error(err.message);
    return res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};


library.readPaymentResponse = async (req, res) => {
  debug.logHeader("Reading Payment Response");
  try {
    const {
      version, request_timestamp, merchant_id, currency, order_id, amount, invoice_no, transaction_ref, approval_code, eci, transaction_datetime, payment_channel, payment_status, channel_response_code, channel_response_desc, masked_pan, stored_card_unique_id, backend_invoice, paid_channel, paid_agent, recurring_unique_id, ippPeriod, ippInterestType, ippInterestRate, ippMerchantAbsorbRate, payment_scheme, process_by, sub_merchant_list, user_defined_1, user_defined_2, user_defined_3, user_defined_4, user_defined_5, mcp, browser_info, mcp_amount, mcp_currency, mcp_exchange_rate, hash_value
    } = req.body;

    const data = {
      version, request_timestamp, merchant_id, currency, order_id, amount, invoice_no, transaction_ref, approval_code, eci, transaction_datetime, payment_channel, payment_status, channel_response_code, channel_response_desc, masked_pan, stored_card_unique_id, backend_invoice, paid_channel, paid_agent, recurring_unique_id, ippPeriod, ippInterestType, ippInterestRate, ippMerchantAbsorbRate, payment_scheme, process_by, sub_merchant_list, user_defined_1, user_defined_2, user_defined_3, user_defined_4, user_defined_5, mcp, browser_info, mcp_amount, mcp_currency, mcp_exchange_rate, hash_value
    };

    const secretKey = process.env.PAYMENT_GATEWAY_SECRET;
    const checkHashStr = version + request_timestamp + merchant_id + order_id + invoice_no + currency + amount + transaction_ref + approval_code + eci + transaction_datetime + payment_channel + payment_status + channel_response_code + channel_response_desc + masked_pan + stored_card_unique_id + backend_invoice + paid_channel + paid_agent + recurring_unique_id + user_defined_1 + user_defined_2 + user_defined_3 + user_defined_4 + user_defined_5 + browser_info + ippPeriod + ippInterestType + ippInterestRate + ippMerchantAbsorbRate + payment_scheme + process_by + sub_merchant_list;

    const checkHash = crypto.createHmac('sha256', secretKey).update(checkHashStr).digest('hex');
 
    if (checkHash.toLowerCase() !== hash_value.toLowerCase()) {
      throw flaverr('E_HASH_CHECK', Error('Hash check = failed. Do not use this response data.'));
    }

    // check amount
    if (parseFloat(amount) < 0) throw flaverr('E_BAD_REQUEST', Error('amount cannot below 0'));

    // user_defined_1 = cart_id
    if (!user_defined_1 || user_defined_1 == '') {
      throw flaverr('E_BAD_REQUEST', Error(`cart id cannot be empty`));
    }

    const result = await sequelize.transaction(async (t) => {
      const cart = await Cart.findOne({
        where: {
          id: user_defined_1
        },
        include: {
          model: Payment,
        },
      });

      if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${user_defined_1} is not exist`));
      if (cart.Payment && cart.Payment.payment_status === '000') throw flaverr('E_PAYMENT_EXIST', Error('previous payment already succeed'));

      let cart_status, createPayment;

      switch (payment_status) {
        case '001':
          cart_status = 'Waiting for Payment';
          break;

        case '002':
          cart_status = 'Payment Rejected';
          break;

        case '003':
          cart_status = 'Payment Cancelled by User';
          break;

        case '999':
          cart_status = 'Payment Failed';
          break;

        case '000':
          cart_status = 'Paid';
          break;

        default:
          cart_status = 'Unknown Error'
          break;
      }

      // payment obj
      if (cart.Payment) {
        const payment = await Payment.findOne({
          where: {
            id: cart.Payment.id
          }
        });

        createPayment = payment;
        createPayment.merchant_id = merchant_id;
        createPayment.order_id = order_id;
        createPayment.invoice_no = invoice_no;
        createPayment.currency = currency;
        createPayment.amount = amount;
        createPayment.payment_status = payment_status;
        createPayment.request_timestamp = request_timestamp;
        await createPayment.save();
      } else {
        const paymentData = {
          merchant_id,
          order_id,
          invoice_no,
          currency,
          amount,
          payment_status,
          request_timestamp,
        };
        
        createPayment = await Payment.create(paymentData, { transaction: t });
      }

      // update cart_status in cart
      cart.cart_status = cart_status;
      await cart.save();

      // add cart_id, user_id to payment
      createPayment.cart_id = cart.id;
      createPayment.user_id = cart.user_id;

      // add payment to cart
      await cart.setPayment(createPayment, { transaction: t });

      // session obj
      const session = await Session.findOne({
        where: {
          id: cart.session_id
        }
      });

      // add session to payment
      await createPayment.setSession(session, { transaction: t });

      // save
      await createPayment.save();

      return createPayment;
    });

    if (result) {
      const url = process.env.BASE_LINK_CART_FRONT_END;
      return res.status(200).json({"status":"success"});
      return res.redirect(`${url}/buy/${user_defined_1}`);
    } else {
      throw flaverr('E_INTERNAL_SERVER_ERROR', Error('something went wrong'));
    }
  } catch (err) {
    debug.error(err.message);
    return res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

module.exports = library;
