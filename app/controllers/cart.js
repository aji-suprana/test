const flaverr = require('flaverr');
const debug =require('../services/debug');
const generateOrderId = require('../services/generate-order-id');
const lodash = require('lodash');
const cartRepo = require('../repository/cart')
const dayjs = require('dayjs')

const save = async (req, res, next) => {
    try {
        debug.logHeader("CREATING CART")
        const session = await Session.findOne({
            where: {
                id: req.body.session_id
            },
        });

        debug.log("check if session exist");
        if (!session) throw flaverr('E_NOT_FOUND', Error(`session with id ${req.body.session_id} is not exist`));

        debug.log("creating cart");
        const order_id = generateOrderId();
        const date = new Date(dayjs().add('15', 'day'));
        const cart = {
            user_id: session.user_id,
            session_id: req.body.session_id,
            order_id: order_id,
            expiry_date:  date
        }

        const save = await Cart.create(cart);

        return res.status(200).json({
            status: 'success',
            data: save
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const update = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: Checkout
            }
        });

        if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.params.id} is not exist`));
        if (cart.Checkout) throw flaverr('E_NOT_FOUND', Error(`cart is already checkout`));

        const save = await cart.save();

        return res.status(200).json({
            status: 'success',
            data: save
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

const destroy = async (req, res, next) => {
    try {
        debug.logHeader("deleting a cart")
        const cart = await Cart.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: CartProduct,
                as: 'cart_products',
            }
        });

        if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.params.id} is not exist`));

        if (cart.cart_products) {
            for (let cartProd of cart.cart_products) {
                let product = await Product.findOne({
                    where: {
                        id: cartProd.product_id
                    }
                });

                product.product_stock += cartProd.quantity;
                product.product_sold -= cartProd.quantity;

                await product.save();
            }
        }

        const destroy = await cart.destroy();

        return res.status(200).json({
            status: 'success',
            data: destroy
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

const findById = async (req, res, next) => {
    try {
        debug.logHeader("find cart by id")
        const cart = await Cart.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Session,
                attributes: ['cart_editable']
            },            
            {
                model:User,
                include:{
                    model: Business,
                },
                attributes:['first_name','last_name','email']
            },
            {
                model: CartProduct,
                include: {
                    model: Product,
                    attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],
                },
                as: 'cart_products',
            }, {
                model: Payment
            }, {
                model: CartDelivery,
                include: {
                    model: Delivery
                }
            }, {
                model: Checkout,
            }, {
                model: Tag,
                attributes: ['name','id']
            }],
        });

        debug.logData("cart found", cart.toJSON())
        if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: cart
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

const findAll = async (req, res, next) => {
    try {
        debug.logHeader('Finding All Cart')
        req.query.page = req.query.page ? req.query.page : 1;
        req.query.per_page = req.query.per_page ? req.query.per_page : 50;
        const where = {}
        if (req.query.user_id) where.user_id = { [Op.eq]: req.query.user_id }
        if (req.query.session_id) where.session_id = { [Op.eq]: req.query.session_id }
        if (req.query.cart_status) where.cart_status = { [Op.eq]: req.query.cart_status }
        if(req.query.is_expired != null) {
            debug.logData('query.is_expired',req.query.is_expired)
            if(req.query.is_expired == 'false')
            {
                debug.log("find date larger than current date")
                where.expiry_date = {[Op.gt] : new Date()} 
            }
            else
            {
                debug.log("find date smaller than current date")
                where.expiry_date = { [Op.lt] : new Date()} 
            }
        }
        debug.logData("query",req.query);
        debug.logData("where",where);

        const { count, rows } = await Cart.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where,
            include: [{
                model: Session,
                attributes: ['cart_editable']
            },
            {
                model:User,
                include:{
                    model: Business,
                },
                attributes:['first_name','last_name','email']
            },
            {
                model: CartProduct,
                include: {
                    model: Product,
                    attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],

                },
                as: 'cart_products'
            }, 
            {
                model: Payment
            }, 
            {
                model: CartDelivery,
                include: {
                    model: Delivery
                }
            }, 
            {
                model: Checkout,
            }, 
            {
                model: Tag,
                attributes:  ['name','id']
            }]
        });

        debug.logData('cart found count',count)
        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`cart not found`));

        const result = paginate({
            data: rows,
            count: count,
            page: req.query.page,
            per_page: req.query.per_page
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

const addProductToCart = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Checkout
                }, {
                    model: Session,
                    attributes: ['cart_editable']
                }],
                transaction: t
            });

            for (const prod of req.body.products) {
                const sessionProduct = await SessionProduct.findOne({
                    where: {
                        session_id: cart.session_id,
                        product_id: prod.id
                    }
                });

                if (!sessionProduct) throw flaverr('E_NOT_FOUND', Error(`product with id ${prod.id} is not in session ${cart.session_id}`));
            }

            if (!cart) throw flaverr('E_NOT_FOUND', new Error(`cart with id ${req.body.cart_id} is not exist`));
            if (cart.Checkout) throw flaverr('E_NOT_FOUND', new Error(`cart is already checkout`));
            
            if (!cart.Session.cart_editable) throw flaverr('E_CART_EDITABLE', new Error(`cart with session id ${cart.session_id} is not editable`));

            let failed = []
            let success = []
            for (let prod of req.body.products) {
                let product = await Product.findOne({
                    where: {
                        id: prod.id
                    },
                    transaction: t
                });

                if (product) {

                    if (prod.quantity > product.product_stock) throw flaverr('E_NOT_FOUND', new Error(`product_stock with id ${product.id} is out of limit`));

                    let cartProduct = await CartProduct.findOne({
                        where: {
                            cart_id: cart.id,
                            product_id: prod.id
                        }, transaction: t
                    })

                    let cartProductQuantity = prod.quantity

                    if (cartProduct) {
                        cartProduct = await CartProduct.findOne({
                            where: {
                                cart_id: cart.id,
                                product_id: prod.id
                            }, transaction: t
                        })
                        cartProduct.quantity += prod.quantity;
                        await cartProduct.save();
                        cartProductQuantity = cartProduct.quantity
                    } else {
                        const createCartProduct = await CartProduct.create({
                            cart_id: cart.id,
                            product_id: prod.id,
                            quantity: cartProductQuantity
                        });

                        await cart.addCart_products(createCartProduct, {
                            transaction: t
                        });
                    }

                    product.product_stock -= prod.quantity;
                    product.product_sold += prod.quantity;
                    await product.save();

                    success.push(prod);
                }
                else {
                    failed.push(prod);
                }
            }

            return {
                success,
                failed
            }
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

const removeProductFromCart = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: CartProduct,
                    as: 'cart_products',
                    include: {
                        model: Product
                    }
                }, {
                    model: Session,
                    attributes: ['cart_editable']
                }, {
                    model: Checkout
                }], transaction: t
            });

            if (!cart) throw flaverr('E_NOT_FOUND', new Error(`cart with id ${req.body.cart_id} is not exist`));
            if (cart.Checkout) throw flaverr('E_NOT_FOUND', new Error(`cart is already checkout`));
            if (!cart.Session.cart_editable) throw flaverr('E_CART_EDITABLE', new Error(`cart with session id ${cart.session_id} is not editable`));
            if (!cart.cart_products.length) throw flaverr('E_NOT_FOUND', new Error(`CartProduct with cart id ${req.body.cart_id} is not exist`));

            let failed = []
            let success = []

            for (let prod of req.body.products) {
                let product = await Product.findOne({
                    where: {
                        id: prod
                    },
                    transaction: t
                });

                if (product) {
                    for (let cartProd of cart.cart_products) {
                        const cartProduct = await CartProduct.findOne({
                            cart_id: cart.id,
                            product_id: prod.id
                        }, { transaction: t });

                        if (cartProd.Product.id === prod) {
                            await cartProduct.destroy()
                            
                            product.product_stock += cartProd.quantity;
                            product.product_sold -= cartProd.quantity;
                            await product.save();

                            success.push(prod);
                        } else {
                            failed.push(prod);
                        }
                    }
                } else {
                    failed.push(prod);
                }
            }

            return {
                success,
                failed
            }
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

const addPayment = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Payment
                }],
                transaction: t
            });

            if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.body.cart_id} is not exist`));
            if (cart.Payment) throw flaverr('E_NOT_FOUND', Error(`payment already exist`));

            let payment = await Payment.findOne({
                where: {
                    id: req.body.payment_id
                }
            });

            if (!payment) throw flaverr('E_NOT_FOUND', Error(`payment with code ${req.body.payment_id} is not exist`));

            payment.cart_id = cart.id
            payment.user_id = cart.user_id
            await payment.save();

            await cart.setPayment(payment, { transaction: t });

            // add relation session_id in payment
            const session = await Session.findOne({
                where: {
                    id: cart.session_id
                }
            });

            await payment.setSession(session, { transaction: t });

            const cartUpdate = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Payment
                }],
                transaction: t
            });

            return cartUpdate
        });


        return res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const removePayment = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Payment
                }],
                transaction: t
            });

            if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.body.cart_id} is not exist`));

            if (!cart.Payment) throw flaverr('E_NOT_FOUND', Error(`payment is not exist`));

            // remove relation session_id in payment
            let payment = await Payment.findOne({
                where: {
                    id: cart.Payment.id
                }
            });

            payment.cart_id = null
            payment.user_id = null
            await payment.save();

            await payment.setSession(null, { transaction: t });
            await cart.setPayment(null, { transaction: t });

            const cartUpdate = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Payment
                }],
                transaction: t
            });

            return cartUpdate
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const addDelivery = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Payment
                }, {
                    model: CartDelivery,
                    include: {
                        model: Delivery
                    }
                }],
                transaction: t
            });

            if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.body.cart_id} is not exist`));

            if (cart.CartDelivery) throw flaverr('E_NOT_FOUND', Error(`delivery already exist`));

            let delivery = await Delivery.findOne({
                where: {
                    id: req.body.delivery_id
                }
            });

            if (!delivery) throw flaverr('E_NOT_FOUND', Error(`delivery with code ${req.body.delivery_id} is not exist`));

            const cartDelivery = await CartDelivery.create({
                cart_id: cart.id,
                delivery_id: delivery.id
            });

            await cart.setCartDelivery(cartDelivery, { transaction: t });

            // session obj
            const session = await Session.findOne({
                where: {
                    id: cart.session_id
                }
            });

    //        await delivery.setSession(session, { transaction: t });

            const cartUpdate = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Payment
                }, {
                    model: CartDelivery,
                    include: {
                        model: Delivery
                    }
                }],
                transaction: t
            });

            return cartUpdate
        });


        return res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const updateDelivery = async (req, res) => {
    try {
        debug.logHeader('update delivery')
        const result = await sequelize.transaction(async (t) => {
            const cart = await Cart.findOne({
                where: {
                    id: req.params.id
                },
                include: {
                    model: CartDelivery,
                    include: {
                        model: Delivery
                    }
                },
                raw : true,
                nest : true
            }, { transaction: t });
            
            debug.logData("cart find one", cart);

            if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.body.cart_id} is not exist`));
          
            if (!cart.CartDelivery) throw flaverr('E_NOT_FOUND', Error(`delivery in cart is not exist. add delivery first`));
    
            // new delivery
            const delivery = await Delivery.findOne({
                where: {
                    id: req.body.delivery_id
                },
                raw : true,
                nest : true
            }, { transaction: t });

            debug.logData("delivery find one", delivery);

            if (!delivery) throw flaverr('E_NOT_FOUND', Error(`delivery with code ${req.body.delivery_id} is not exist`));

            // update new delivery
            const newCartDelivery = await CartDelivery.findOne(
            {
                where : {
                    cart_id: cart.id,
                }
            }, { transaction: t });

            newCartDelivery.delivery_id = delivery.id;
            await newCartDelivery.save();

            // session obj
            const session = await Session.findOne({
                where: {
                    id: cart.session_id
                }
            }, { transaction: t });

            //await delivery.setSession(session, { transaction: t });
    
            const updatedCart = await Cart.findOne({
                where: {
                    id: req.params.id
                },
                include: {
                    model: CartDelivery,
                    include: {
                        model: Delivery
                    }
                },
            }, { transaction: t });

            return updatedCart;
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const removeDelivery = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: {
                    model: CartDelivery
                },
            }, { transaction: t });

            if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.body.cart_id} is not exist`));

            if (!cart.CartDelivery) throw flaverr('E_NOT_FOUND', Error(`delivery is not exist`));

            // remove cart delivery
            const cartDelivery = await CartDelivery.findOne({
                where: {
                    cart_id: cart.id
                }
            });

            await cartDelivery.destroy();

            const cartUpdate = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: {
                    model: CartDelivery
                },
            }, { transaction: t });

            return cartUpdate
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const addProductQuantity = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            let cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Checkout
                }, {
                    model: Session,
                    attributes: ['cart_editable']
                }],
                transaction: t
            })

            if (cart.Checkout) throw flaverr('E_NOT_FOUND', Error(`cart is already checkout`))
            
            if (!cart.Session.cart_editable) throw flaverr('E_CART_EDITABLE', Error(`cart with session id ${cart.session_id} is not editable`));

            let product = await Product.findOne({
                where: {
                    id: req.body.product_id
                }, transaction: t
            })

            if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.body.product_id} is not exist`))

            let cartProduct = await CartProduct.findOne({
                where: {
                    cart_id: req.body.cart_id,
                    product_id: req.body.product_id
                }, transaction: t
            })

            if (!cartProduct) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.body.product_id} is in cart`))

            let addQuantity = 1
            if (req.body.quantity && parseInt(req.body.quantity) > 0) addQuantity = parseInt(req.body.quantity)

            if (product.product_stock - addQuantity < 0) throw flaverr('E_EXCEED_MAX_STOCK', Error(`quantity cannot exceed maximum stock. Input: ${addQuantity}, Max: ${product.product_stock}`));

            cartProduct.quantity += addQuantity
            product.product_stock -= addQuantity
            product.product_sold += addQuantity

            let update = await cartProduct.save({ transaction: t })
            await product.save({ transaction: t })

            return {
                update
            }
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

const reduceProductQuantity = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            let cart = await Cart.findOne({
                where: {
                    id: req.body.cart_id
                },
                include: [{
                    model: Checkout
                }, {
                    model: Session,
                    attributes: ['cart_editable']
                }],
                transaction: t
            })

            if (cart.Checkout) throw flaverr('E_NOT_FOUND', Error(`cart is already checkout`))

            if (!cart.Session.cart_editable) throw flaverr('E_CART_EDITABLE', Error(`cart with session id ${cart.session_id} is not editable`));

            let product = await Product.findOne({
                where: {
                    id: req.body.product_id
                }, transaction: t
            })

            if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.body.product_id} is not exist`))

            let cartProduct = await CartProduct.findOne({
                where: {
                    cart_id: req.body.cart_id,
                    product_id: req.body.product_id
                }, transaction: t
            })

            if (!cartProduct) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.body.product_id} is in cart`))

            let reduceQuantity = 1
            if (req.body.quantity && parseInt(req.body.quantity) > 0) reduceQuantity = parseInt(req.body.quantity)

            if (cartProduct.quantity - reduceQuantity < 0) throw flaverr('E_NEGATIVE_QUANTITY', Error(`quantity cannot be reduced below 0. Input: ${reduceQuantity}, Current: ${cartProduct.quantity}`));
            
            cartProduct.quantity -= reduceQuantity
            product.product_stock += reduceQuantity
            product.product_sold -= reduceQuantity

            let update = await cartProduct.save({ transaction: t })
            await product.save({ transaction: t })

            return {
                update
            }
        });

        return res.status(200).json({
            status: 'success',
            data: result
        });
    }
    catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

async function UpdateCartStatus(req,res)
{
    try{
        debug.logHeader("update cart status");
        var response = {success:[],failed:[]}
        asyncForEach(req.body,
            async value=> {
            debug.logHeader(`update ${value.cart_id}`)
            debug.logData("cart_id", value.cart_id);
            debug.logData("status", value.status);

            const tresult = await sequelize.transaction(async (t) => {
                let cart = await Cart.findOne({
                    where: {
                        id: value.cart_id
                    },
                    include: [{
                        model: Checkout
                    }, {
                        model: Session,
                        attributes: ['cart_editable']
                    }],
                    transaction: t
                })
        
                if (!cart)
                {
                    debug.logError("invalid cart_id")
                    response.failed.push({status:'INVALID_CART_ID',cart_id:value.cart_id})
                    return;
                } 
        
                let cart_status = lodash.toUpper(cart.cart_status);
                debug.logData("cart status",cart_status)
        
                var validateStatus = cartRepo.ValidateCartStatus(value.status);
                debug.logData("valid status?",validateStatus);
        
                if(validateStatus.status != 'SUCCESS') 
                {
                    debug.logError('invalid cart_status')
                    response.failed.push({status:'INVALID_CART_STATUS',cart_id:value.cart_id})
                    return;
                }
        
                cart.cart_status = value.status;
                cart.save();
                response.success.push({cart_id:cart.id, newStatus : cart.cart_status})

                return response;
            })
        }).then(()=>{
            debug.logData('result',response);
            res.status(200).json(response);
        })
    }catch (err) {
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
                status: 'failed',
                message: err.message
            });
    }
}

function GetCartStatus(req,res)
{
    return res.status(200).json(require('../../config/cartStatus'));
}

module.exports = {
    save,
    destroy,
    update,
    findById,
    findAll,
    addProductToCart,
    removeProductFromCart,
    addPayment,
    removePayment,
    addDelivery,
    updateDelivery,
    removeDelivery,
    addProductQuantity,
    reduceProductQuantity,
    UpdateCartStatus,
    GetCartStatus,
}