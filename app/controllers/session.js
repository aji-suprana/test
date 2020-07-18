const flaverr = require('flaverr');
const log = require('../services/debug');
const save = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.userData.id
            }
        });

        if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id ${req.user.userData.id} is not exist, please login and take the token`));

        const prevSession = await Session.findOne({
            where: {
                user_id: req.user.userData.id
            }
        });

        if (prevSession && !prevSession.is_expired) throw flaverr('E_NOT_FOUND', Error(`session with user_id ${req.user.userData.id} is exist`));

        const session = {
            session_name: req.body.session_name,
            description: req.body.description,
            cart_editable: req.body.cart_editable,
            expired_at: req.body.expired_at,
            user_id: req.user.userData.id,
            session_code: getUniqueId(6)
        }

        const save = await Session.create(session);

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
        const session = await Session.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!session) throw flaverr('E_NOT_FOUND', Error(`session with id ${req.params.id} is not exist`));

        if (req.body.session_name) session.session_name = req.body.session_name
        if (req.body.description) session.description = req.body.description
        if (req.body.cart_editable) session.cart_editable = req.body.cart_editable
        if (req.body.expired_at) session.expired_at = req.body.expired_at
        if (req.body.is_expired) session.is_expired = req.body.is_expired

        const save = await session.save();

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
        const session = await Session.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!session) throw flaverr('E_NOT_FOUND', Error(`session with id ${req.params.id} is not exist`));

        const destroy = await session.destroy();

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
        const session = await Session.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Product,
                as: 'session_products'
            }, {
                model: Delivery,
                as: 'session_deliveries'
            }, {
                model: PaymentOption,
                as: 'session_paymentoptions'
            }, {
                model: Cart,
                include: [{
                    model: CartProduct,
                    as: 'cart_products',
                    include:[{
                        model:Product
                    }]
                }]
            }]
        });

        if (!session) throw flaverr('E_NOT_FOUND', Error(`session with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: session
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
        req.query.page = req.query.page ? req.query.page : 1;
        req.query.per_page = req.query.per_page ? req.query.per_page : 50;
        const where = {}
        if (req.query.session_name) where.session_name = { [Op.like]: `%${req.query.session_name}%` }
        if (req.query.description) where.description = { [Op.like]: `%${req.query.description}%` }
        if (req.query.is_expired) where.is_expired = { [Op.eq]: req.query.is_expired }
        if (req.query.user_id) where.user_id = { [Op.eq]: req.query.user_id }
        if (req.query.start_exp_date && req.query.end_exp_date) {
            where.expired_at = { [Op.between]: [req.query.start_exp_date, req.query.end_exp_date] }
        }

        const { count, rows } = await Session.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where,
            include: [{
                model: Product,
                as: 'session_products'
            }, {
                model: Delivery,
                as: 'session_deliveries'
            }, {
                model: PaymentOption,
                as: 'session_paymentoptions'
            }, {
                model: Cart,
                include: [{
                    model: CartProduct,
                    as: 'cart_products',
                    include:[{
                        model:Product
                    }]
                }]
            }]
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`session not found`));

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

const addProductToSession = async (req, res, next) => {
    try {
        log.logHeader("add Product To Session");
        const result = await sequelize.transaction(async (t) => {

            const session = await Session.findOne({
                where: {
                    id: req.body.session_id
                },
                transaction: t
            });
            log.message(session);
            if (!session) throw flaverr('E_NOT_FOUND', new Error(`session with id ${req.body.session} is not exist`));

            let failed = []
            let success = []

            //for all product in request body
            for (let prod of req.body.products) {
                //find current product on user's products list
                const product = await Product.findOne({
                    where: {
                        id: prod
                    },
                    transaction: t
                });

                if (product) {
                    await session.addSession_products(product, {
                        transaction: t
                    });
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

const removeProductFromSession = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const session = await Session.findOne({
                where: {
                    id: req.body.session_id
                },
                transaction: t
            });

            if (!session) throw flaverr('E_NOT_FOUND', new Error(`cart with id ${req.body.session_id} is not exist`));

            const products = await Product.findAll({
                where: {
                    id: req.body.products
                },
                transaction: t
            });

            await session.removeSession_products(products, { transaction: t });

            return products
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

const addDeliveryToSession = async (req, res, next) => {
    try {
        log.logHeader("add Delivery To Session");
        const result = await sequelize.transaction(async (t) => {

            const session = await Session.findOne({
                where: {
                    id: req.body.session_id
                },
                transaction: t
            });
            log.message(session);
            if (!session) throw flaverr('E_NOT_FOUND', new Error(`session with id ${req.body.session} is not exist`));

            let failed = []
            let success = []

            //for all delivery in request body
            for (let deliv of req.body.deliveries) {
                //find current delivery on user's deliveries list
                const delivery = await Delivery.findOne({
                    where: {
                        id: deliv
                    },
                    transaction: t
                });

                if (delivery) {
                    await session.addSession_deliveries(delivery, {
                        transaction: t
                    });
                    success.push(deliv);
                }
                else {
                    failed.push(deliv);
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

const removeDeliveryFromSession = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const session = await Session.findOne({
                where: {
                    id: req.body.session_id
                },
                transaction: t
            });

            if (!session) throw flaverr('E_NOT_FOUND', new Error(`cart with id ${req.body.session_id} is not exist`));

            const deliveries = await Delivery.findAll({
                where: {
                    id: req.body.deliveries
                },
                transaction: t
            });

            await session.removeSession_deliveries(deliveries, { transaction: t });

            return deliveries
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

const addPaymentToSession = async (req, res, next) => {
    try {
        log.logHeader("add Payment To Session");
        const result = await sequelize.transaction(async (t) => {

            const session = await Session.findOne({
                where: {
                    id: req.body.session_id
                },
                transaction: t
            });
            log.message(session);
            if (!session) throw flaverr('E_NOT_FOUND', new Error(`session with id ${req.body.session} is not exist`));

            let failed = []
            let success = []

            //for all payment in request body
            for (let pay of req.body.payments) {
                //find current payment on user's payments list
                const payment = await PaymentOption.findOne({
                    where: {
                        id: pay
                    },
                    transaction: t
                });

                if (payment) {
                    await session.addSession_paymentoptions(payment, {
                        transaction: t
                    });
                    success.push(pay);
                }
                else {
                    failed.push(pay);
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

const removePaymentFromSession = async (req, res, next) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const session = await Session.findOne({
                where: {
                    id: req.body.session_id
                },
                transaction: t
            });

            if (!session) throw flaverr('E_NOT_FOUND', new Error(`cart with id ${req.body.session_id} is not exist`));

            const payments = await PaymentOption.findAll({
                where: {
                    id: req.body.payments
                },
                transaction: t
            });

            await session.removeSession_paymentoptions(payments, { transaction: t });

            return payments
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

const realTimeComments = async (data) => {
    try {
        const eventSourceInitDict = {
            https: {
                rejectUnauthorized: false
            }
        }

        const es = new EventSource(`${process.env.FB_SSE_HOST}/${data.video_id}/live_comments?
        access_token=${data.access_token}&comment_rate=one_hundred_per_second&fields=from{name,id},message`,
            eventSourceInitDict);

        es.onerror = (err) => {
            if (err) {
                if (err.status === 401 || err.status === 403) {
                    throw flaverr('E_NOT_AUTHORIZED', Error(`You are not authorized`));
                }
            }
        }

        es.onopen = (msg) => {
            console.log(msg);
        }

        es.onmessage = (msg) => {
            console.log(JSON.parse(msg.data));
        }

        return {
            status: 'success',
            message: 'success to subscribe to realtime live comments'
        }
    }
    catch (err) {
        return {
            status: 'failed',
            message: 'failed to subscribe to realtime live comments'
        }
    }
}

module.exports = {
    save,
    destroy,
    update,
    findById,
    findAll,
    addProductToSession,
    removeProductFromSession,
    addDeliveryToSession,
    removeDeliveryFromSession,
    addPaymentToSession,
    removePaymentFromSession
}