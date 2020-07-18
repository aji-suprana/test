const flaverr = require('flaverr');
const encryption = require('../services/encryption');
const notifyBuyer = require('../services/notify-buyer').notifyBuyer;
const sendMessage = require('../services/send-message').sendMessage;
const debug =require('../services/debug');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create Checkout
const save = async (req, res, next) => {
    try {
        debug.logHeader("Creating Checkout");
        debug.log( req.body);
        const cart = await Cart.findOne({
            where: {
                id: req.body.cart_id
            },
            include: [{
                model: Session,
                attributes: ['cart_editable']
            }, 
            {
                model: CartProduct,
                as: 'cart_products',
                include: {
                    model: Product,
                    attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],
                },
            }, {
                model: Payment
            }, {
                model: CartDelivery,
                include: {
                    model: Delivery
                }
            }, {
                model: Checkout
            }]
        });
        debug.log("cart response",cart);
        console.log("check if cart exist");
        if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${req.body.cart_id} is not exist`));

        const checkDate = Date.now() > cart.expiry_date
        if (checkDate) {
            throw flaverr('E_CART_EXPIRED', Error('cart is expired'));
        }

        const session = await Session.findOne({
            where: {
                id: cart.session_id
            }
        });

        console.log("check if session exist");
        if (session === null) throw flaverr('E_NOT_FOUND', Error(`session with code ${cart.session_id} is not exist`));

        const user = await User.findOne({
            where: {
                id: session.user_id
            }
        });

        console.log("check if session with user id exist")
        if (user === null) throw flaverr('E_NOT_FOUND', Error(`user with code ${session.user_id} is not exist`));

        console.log("check delivery fee from cart-delivery")
        // check delivery fee from cart-delivery
        let delivery_fee = 0.0
        if (cart.CartDelivery) delivery_fee = cart.CartDelivery.Delivery.delivery_fee

        console.log("get cart_products")
        // count purchase amount
        let purchase_amount = await countPurchase({ cart_products: cart.cart_products });

        let buyer = await Buyer.findOrCreate({
            where: {
                fb_id: cart.buyer_fb_id
            },
            defaults: {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                fb_id: cart.buyer_fb_id
            }
        });

        buyer = buyer[0]
        debug.log("get promoid")
        let promo_id;
        if (req.body.promo_code) {
            const promo = await Promo.findOne({
                where: {
                    promo_code: req.body.promo_code
                }
            });

            if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with code ${req.body.promo_code} is not exist`));
            // count promo
            if (promo.min_ammount <= purchase_amount) {
                // promo with percentage reduction
                if (promo.reduction_type === 'percentage') {
                    let discounts = purchase_amount * (promo.promo_discount / 100);
                    if (discounts > promo.max_discount) discounts = promo.max_discount;
                    purchase_amount -= discounts
                }
                // promo with flat reduction
                if (promo.reduction_type === 'flat') {
                    purchase_amount -= promo.promo_discount
                }

                // promo with delivery fee reduction
                if (promo.reduction_type === 'delivery' && cart.CartDelivery.Delivery.delivery_fee) {
                    delivery_fee -= promo.promo_discount
                    if (delivery_fee < 0) delivery_fee = 0.0
                }
            }
            promo_id = promo.id;
        }

        const checkout = {
            cart_id: req.body.cart_id,
            purchase_amount: purchase_amount,
            delivery_fee: delivery_fee,
            promo_id: promo_id,
            buyer_id: buyer.id,
            session_id: session.id,
            user_id: user.id,
            buyer_fb_id: buyer.fb_id,
            buyer_name: buyer.first_name + ' ' + buyer.last_name,
            buyer_email: buyer.email,
            buyer_address: req.body.buyer_address,
            buyer_country: req.body.buyer_country,
            buyer_region: req.body.buyer_region,
            buyer_zip_code: req.body.buyer_zip_code,
            buyer_phone: req.body.buyer_phone,
        }
        debug.log("checkout",checkout);
        const save = await Checkout.create(checkout);
        
        if (save && cart.page_id) {
            const page = await Page.findOne({
                where: {
                    fb_page_id: cart.page_id
                }
            })

            // if (page) {
            //     await notifyBuyer({
            //         accessToken: encryption.decrypt(page.page_token).data,
            //         url: `${process.env.BASE_LINK_CART_FRONT_END}/${checkout.checkout_code}`,
            //         recipient_id: cart.buyer_recipient_id
            //     });

            //     await sendMessage({
            //         accessToken: encryption.decrypt(page.page_token).data,
            //         message: `Hi seller, ${checkout.buyer_name} is succesfully checkout`,
            //         recipient_id: cart.seller_recipient_id
            //     });

            //     await notifyBuyer({
            //         accessToken: encryption.decrypt(page.page_token).data,
            //         url: `${process.env.BASE_LINK_CART_FRONT_END}/${checkout.checkout_code}`,
            //         recipient_id: cart.seller_recipient_id
            //     });
            // }
        }

        const result_cart = await Cart.findOne({
            where: {
                id: req.body.cart_id
            },
            include: [{
                model: Session,
                attributes: ['cart_editable']
            }, 
            {
                model: CartProduct,
                as: 'cart_products',
                include: {
                    model: Product,
                    attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],
                },
            }, {
                model: Payment
            }, {
                model: CartDelivery,
                include: {
                    model: Delivery
                }
            }, {
                model: Checkout
            }]
        });

        return res.status(200).json({
            message: "success",
            data: result_cart
        });
    } catch (err) {
        debug.error(err.message);
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Update Checkout
const update = async (req, res, next) => {
    try {
        const checkout = await Checkout.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Cart
            }, {
                model: Buyer
            }, {
                model: Promo
            }]
        });

        if (!checkout) throw flaverr('E_NOT_FOUND', Error(`checkout with id ${req.params.id} is not exist`));

        const cart = await Cart.findOne({
            where: {
                id: checkout.cart_id
            },
            include: [{
                model: CartProduct,
                as: 'cart_products',
                include: {
                    model: Product,
                    attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],
                },
            }, {
                model: Session
            }]
        });

        if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${checkout.cart_id} is not exist`));

        const checkDate = Date.now() > cart.expiry_date;
        if (checkDate) {
          throw flaverr('E_CART_EXPIRED', Error('cart is expired'));
        }

        // count purchase amount
        const purchase_amount = await countPurchase({ cart_products: cart.cart_products });
        checkout.purchase_amount = purchase_amount;

        if (checkout.promo_id !== null) {
            const promo = await Promo.findOne({
                where: {
                    id: checkout.promo_id
                }
            });

            if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with id ${checkout.promo_id} is not exist`));

            // count promo
            if (promo.min_ammount <= checkout.purchase_amount) {
                // promo with percentage reduction
                if (promo.reduction_type === 'percentage') {
                    let discounts = checkout.purchase_amount * (promo.promo_discount / 100);
                    if (discounts > promo.max_discount) discounts = promo.max_discount;
                    checkout.purchase_amount -= discounts
                }
                // promo with flat reduction
                if (promo.reduction_type === 'flat') {
                    checkout.purchase_amount -= promo.promo_discount
                }

                // promo with delivery fee reduction
                if (promo.reduction_type === 'delivery' && cart.CartDelivery.Delivery.delivery_fee) {
                    checkout.delivery_fee -= promo.promo_discount
                    if (checkout.delivery_fee < 0) checkout.delivery_fee = 0.0
                }
            }
        }

        if (req.body.cart_id) checkout.cart_id = req.body.cart_id
        if (req.body.buyer_id) checkout.buyer_id = req.body.buyer_id
        if (req.body.buyer_address) checkout.buyer_address = req.body.buyer_address
        if (req.body.buyer_country) checkout.buyer_country = req.body.buyer_country
        if (req.body.buyer_region) checkout.buyer_region = req.body.buyer_region
        if (req.body.buyer_zip_code) checkout.buyer_zip_code = req.body.buyer_zip_code
        if (req.body.buyer_phone) checkout.buyer_phone = req.body.buyer_phone
        if (req.body.first_name && req.body.last_name) checkout.buyer_name = req.body.first_name + ' ' + req.body.last_name
        if (req.body.email) checkout.buyer_email = req.body.email

        const update = await checkout.save();

        return res.status(200).json({
            status: 'success',
            data: update
        });
    } catch (err) {
        debug.error(err.message);
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Delete Checkout
const destroy = async (req, res, next) => {
    try {
        const checkout = await Checkout.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: Cart
            }
        });

        if (!checkout) throw flaverr('E_NOT_FOUND', Error(`checkout with id ${req.params.id} is not exist`));

        const checkDate = Date.now() > checkout.Cart.expiry_date;
        if (checkDate) {
          throw flaverr('E_CART_EXPIRED', Error('cart is expired'));
        }

        const destroy = await checkout.destroy();

        return res.status(200).json({
            status: 'success',
            data: destroy
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}
const findById = async (req, res, next) => {
    try {
        let checkout = await Checkout.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Cart,
                include: [{
                    model: Payment,
                }, {
                    model: CartDelivery,
                    include: {
                        model: Delivery
                    }
                }]
            }, {
                model: Buyer
            }, {
                model: Promo
            }]
        });

        if (!checkout) throw flaverr('E_NOT_FOUND', Error(`checkout with id ${req.params.id} is not exist`));

        const cart = await Cart.findOne({
            where: {
                id: checkout.cart_id
            },
            include: [{
                model: CartProduct,
                as: 'cart_products',
                include: {
                    model: Product,
                    attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],
                },
            }, {
                model: Session
            }]
        });

        if (cart) {
            // count purchase amount
            const purchase_amount = await countPurchase({ cart_products: cart.cart_products });
            checkout.purchase_amount = purchase_amount;

            if (checkout.promo_id !== null) {
                const promo = await Promo.findOne({
                    where: {
                        id: checkout.promo_id
                    }
                });

                if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with id ${checkout.promo_id} is not exist`));

                // count promo
                if (promo.min_ammount <= checkout.purchase_amount) {
                    // promo with percentage reduction
                    if (promo.reduction_type === 'percentage') {
                        let discounts = checkout.purchase_amount * (promo.promo_discount / 100);
                        if (discounts > promo.max_discount) discounts = promo.max_discount;
                        checkout.purchase_amount -= discounts
                    }
                    // promo with flat reduction
                    if (promo.reduction_type === 'flat') {
                        checkout.purchase_amount -= promo.promo_discount
                    }

                    // promo with delivery fee reduction
                    if (promo.reduction_type === 'delivery' && cart.CartDelivery.Delivery.delivery_fee) {
                        checkout.delivery_fee -= promo.promo_discount
                        if (checkout.delivery_fee < 0) checkout.delivery_fee = 0.0
                    }
                }
            }

            checkout = await checkout.save();
        }

        const checkoutUpdate = await Checkout.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Cart,
                include: [{
                    model: Payment,
                }, {
                    model: CartDelivery,
                    include: {
                        model: Delivery
                    }
                }]
            }, {
                model: Buyer
            }, {
                model: Promo
            }]
        });

        return res.status(200).json({
            status: 'success',
            data: checkoutUpdate
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Find All Checkout
const findAll = async (req, res, next) => {
    try {
        debug.logHeader("Find All Checkout")
        const checkoutUpdate = await Checkout.findAll({
            include: [{
                model: Cart
            }, {
                model: Buyer
            }, {
                model: Promo
            }]
        });
        debug.log("checkout",checkoutUpdate);
        if (checkoutUpdate.length === 0) throw flaverr('E_NOT_FOUND', Error(`checkout not found`));


        for (checkout of checkoutUpdate) {
            const cart = await Cart.findOne({
                where: {
                    id: checkout.cart_id
                },
                include: [{
                    model: CartProduct,
                    as: 'cart_products',
                    include: {
                        model: Product,
                        attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],
                    },
                }, {
                    model: Session
                }]
            });

            if (cart) {
                // count purchase amount
                const purchase_amount = await countPurchase({ cart_products: cart.cart_products });
                checkout.purchase_amount = purchase_amount;

                if (checkout.promo_id !== null) {
                    const promo = await Promo.findOne({
                        where: {
                            id: checkout.promo_id
                        }
                    });

                    if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with id ${checkout.promo_id} is not exist`));

                    // count promo
                    if (promo.min_ammount <= checkout.purchase_amount) {
                        // promo with percentage reduction
                        if (promo.reduction_type === 'percentage') {
                            let discounts = checkout.purchase_amount * (promo.promo_discount / 100);
                            if (discounts > promo.max_discount) discounts = promo.max_discount;
                            checkout.purchase_amount -= discounts
                        }
                        // promo with flat reduction
                        if (promo.reduction_type === 'flat') {
                            checkout.purchase_amount -= promo.promo_discount
                        }

                        // promo with delivery fee reduction
                        if (promo.reduction_type === 'delivery' && cart.CartDelivery.Delivery.delivery_fee) {
                            checkout.delivery_fee -= promo.promo_discount
                            if (checkout.delivery_fee < 0) checkout.delivery_fee = 0.0
                        }
                    }
                }

                await checkout.save();
            }
        }

        req.query.page = req.query.page ? req.query.page : 1;
        req.query.per_page = req.query.per_page ? req.query.per_page : 50;
        const where = {}
        if (req.query.checkout_code) where.checkout_code = { [Op.like]: `%${req.query.checkout_code}%` }
        if (req.query.session_id) where.session_id = { [Op.eq]: req.query.session_id }
        if (req.query.cart_id) where.cart_id = { [Op.eq]: req.query.cart_id }
        if (req.query.user_id) where.user_id = { [Op.eq]: req.query.user_id }
        if (req.query.start_price && req.query.end_price) {
            where.purchase_amount = { [Op.between]: [req.query.start_price, req.query.end_price] }
        }

        const { count, rows } = await Checkout.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where,
            include: [{
                model: Cart,
                include: [{
                    model: Payment,
                }, {
                    model: CartDelivery,
                    include: {
                        model: Delivery
                    }
                }]
            }, {
                model: Buyer
            }, {
                model: Promo
            }, {
                model: Session
            }, {
                model: User
            }]
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`checkout not found`));

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
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Update Checkout
const changeStatus = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const checkout = await Checkout.findOne({
                where: {
                    id: req.body.checkout_id
                },
                include: [{
                    model: Cart
                }, {
                    model: Buyer
                }, {
                    model: Promo
                }],
                transaction: t
            });

            if (!checkout) throw flaverr('E_NOT_FOUND', Error(`checkout with id ${req.body.checkout_id} is not exist`));

            const cart = await Cart.findOne({
                where: {
                    id: checkout.Cart.id
                },
                include: [{
                    model: CartProduct,
                    as: 'cart_products',
                    include: {
                        model: Product,
                        attributes: ['product_name', 'description', 'price', 'unit', 'unit_measure'],
                    },
                }, {
                    model: Session
                }],
                transaction: t
            });

            const checkDate = Date.now() > cart.expiry_date;
            if (checkDate) {
              throw flaverr('E_CART_EXPIRED', Error('cart is expired'));
            }

            if (req.body.cart_status) cart.cart_status = req.body.cart_status;
            const updateCart = await cart.save({ transaction: t });

            for (let prod of cart.cart_products) {
                if (updateCart.status === "payment confirmed") {
                    const product = await Product.findOne({
                        where: {
                            id: prod.product_id
                        },
                        transaction: t
                    });

                    product.product_stock -= prod.quantity;
                    product.product_sold += prod.quantity;
                    await product.save({ transaction: t });
                }
            }

            return updateCart
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add Promo To Checkout
const addPromo = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const checkout = await Checkout.findOne({
                where: {
                    id: req.body.checkout_id
                },
                include: [{
                    model: Cart
                }, {
                    model: Buyer
                }, {
                    model: Promo
                }],
                transaction: t
            });

            if (!checkout) throw flaverr('E_NOT_FOUND', Error(`checkout with id ${req.body.checkout_id} is not exist`));

            if (checkout.promo_id !== null) throw flaverr('E_NOT_FOUND', Error(`promo already exist`));

            const promo = await Promo.findOne({
                where: {
                    promo_code: req.body.promo_code
                }
            });

            if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with code ${req.body.promo_code} is not exist`));

            // count promo
            if (promo.min_ammount <= checkout.purchase_amount) {
                // promo with percentage reduction
                if (promo.reduction_type === 'percentage') {
                    let discounts = checkout.purchase_amount * (promo.promo_discount / 100);
                    if (discounts > promo.max_discount) discounts = promo.max_discount;
                    checkout.purchase_amount -= discounts
                }
                // promo with flat reduction
                if (promo.reduction_type === 'flat') {
                    checkout.purchase_amount -= promo.promo_discount
                }

                // promo with delivery fee reduction
                if (promo.reduction_type === 'delivery' && cart.CartDelivery.Delivery.delivery_fee) {
                    checkout.delivery_fee -= promo.promo_discount
                    if (checkout.delivery_fee < 0) checkout.delivery_fee = 0.0
                }
            }

            await checkout.setPromo(promo, { transaction: t });
            await checkout.save({ transaction: t });

            const checkoutUpdate = await Checkout.findOne({
                where: {
                    id: checkout.id
                },
                include: [{
                    model: Cart
                }, {
                    model: Buyer
                }, {
                    model: Promo
                }],
                transaction: t
            });

            return checkoutUpdate
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Remove Promo Checkout
const removePromo = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const checkout = await Checkout.findOne({
                where: {
                    id: req.body.checkout_id
                },
                include: [{
                    model: Cart,
                }, {
                    model: Buyer
                }, {
                    model: Promo
                }],
                transaction: t
            });

            if (!checkout) throw flaverr('E_NOT_FOUND', Error(`checkout with id ${req.body.checkout_id} is not exist`));

            const cart = await Cart.findOne({
                where: {
                    id: checkout.cart_id
                },
                include: [{
                    model: CartProduct,
                    as: 'cart_products',
                    include: {
                        model: Product
                    }
                }, {
                    model: Session
                }]
            });

            if (!cart) throw flaverr('E_NOT_FOUND', Error(`cart with id ${checkout.cart_id} is not exist`));

            if (!checkout.promo_id) throw flaverr('E_NOT_FOUND', Error(`promo is not exist`));

            const promo = await Promo.findOne({
                where: {
                    promo_code: checkout.Promo.promo_code
                }
            });

            if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with code ${checkout.Promo.promo_code} is not exist`));

            // count purchase amount
            const purchase_amount = await countPurchase({ cart_products: cart.cart_products });
            checkout.purchase_amount = purchase_amount;

            await checkout.setPromo(null, { transaction: t });
            await checkout.save({ transaction: t });

            const checkoutUpdate = await Checkout.findOne({
                where: {
                    id: checkout.id
                },
                include: [{
                    model: Cart
                }, {
                    model: Buyer
                }, {
                    model: Promo
                }],
                transaction: t
            });

            return checkoutUpdate
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

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll,
    changeStatus,
    addPromo,
    removePromo,
}