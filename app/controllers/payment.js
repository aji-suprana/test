const flaverr = require('flaverr');
const cloudinary = require('../services/cloudinary');
const sendMessage = require('../services/send-message').sendMessage;
const encryption = require('../services/encryption');
const fs = require('file-system');

const save = async (req, res) => {
    try {
        // Payment status [Pending Payment Submission, Pending Payment Review, Payment Approved]
        const payment_status = "pending delivery";

        const {
            merchant_id,
            order_id,
            invoice_no,
            currency,
            amount,
            request_timestamp,
        } = req.body;

        if (amount < 0) throw flaverr('E_BAD_REQUEST', Error('amount cannot below 0'));

        const paymentData = {
            merchant_id,
            order_id,
            invoice_no,
            currency,
            amount,
            payment_status,
            request_timestamp
        }

        const save = await Payment.create(paymentData);

        return res.status(200).json({
            message: "success",
            data: save,
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const update = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!payment) throw flaverr('E_NOT_FOUND', Error(`payment with id ${req.params.id} is not exist`));

        const {
            merchant_id,
            order_id,
            invoice_no,
            currency,
            amount,
            request_timestamp
        } = req.body;

        if (amount < 0) throw flaverr('E_BAD_REQUEST', Error('amount cannot below 0'));

        payment.merchant_id = merchant_id;
        payment.order_id = order_id;
        payment.invoice_no = invoice_no;
        payment.currency = currency;
        payment.amount = amount;
        payment.request_timestamp = request_timestamp;

        const update = await payment.save();

        return res.status(200).json({
            status: 'success',
            data: update
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}

const destroy = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!payment) throw flaverr('E_NOT_FOUND', Error(`payment with id ${req.params.id} is not exist`));

        const destroy = await payment.destroy();

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

const findById = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: Session
            }
        });

        if (!payment) throw flaverr('E_NOT_FOUND', Error(`payment with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: payment
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
}
const findAll = async (req, res) => {
    try {
        req.query.page = req.query.page ? req.query.page : 1;
        req.query.per_page = req.query.per_page ? req.query.per_page : 50;
        const where = {}
        if (req.query.merchant_id) where.merchant_id = { [Op.like]: `%${req.query.merchant_id}%` }
        if (req.query.order_id) where.order_id = { [Op.like]: `%${req.query.order_id}%` }
        if (req.query.invoice_no) where.invoice_no = { [Op.like]: `%${req.query.invoice_no}%` }
        if (req.query.currency) where.currency = { [Op.like]: `%${req.query.currency}%` }
        if (req.query.payment_status) where.payment_status = { [Op.like]: `%${req.query.payment_status}%` }
        if (req.query.session_id) where.session_id = { [Op.eq]: req.query.session_id }
        if (req.query.cart_id) where.cart_id = { [Op.eq]: req.query.cart_id }
        if (req.query.user_id) where.user_id = { [Op.eq]: req.query.user_id }
        if (req.query.start_price && req.query.end_price) {
            where.amount = { [Op.between]: [req.query.start_price, req.query.end_price] }
        }

        const { count, rows } = await Payment.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where,
            include: {
                model: Session
            }
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`payment not found`));

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

const uploadPaymentImage = async (req, res) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const payment = await Payment.findOne({
                where: {
                    id: req.body.payment_id
                },
                transaction: t
            });

            if (!payment) throw flaverr('E_NOT_FOUND', Error(`checkout with id ${req.params.id} is not exist`));

            // Payment status [Pending Payment Submission, Pending Payment Review, Payment Approved]

            let payment_status = "Pending Payment Submission";
            let payment_image;
            if (req.file) {
                const uploader = async (path) => await cloudinary.uploads(path, 'images');
                const file = req.file
                const { path } = file
                payment_image = await uploader(path)
                payment_image = payment_image.url
                fs.unlinkSync(path)
            } else {
                throw flaverr('E_NOT_FOUND', Error(`payment image not uploaded`));
            }

            if (payment_image) {
                payment.payment_status = "Pending Payment Review";
                payment.payment_image = payment_image;
            }

            const update = await payment.save({ transaction: t });

            return update
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

const changeStatus = async (req, res) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const payment = await Payment.findOne({
                where: {
                    id: req.body.payment_id
                },
                transaction: t
            });

            if (!payment) throw flaverr('E_NOT_FOUND', Error(`payment with id ${req.params.id} is not exist`));

            const cart = await Cart.findOne({
                where: {
                    id: payment.cart_id
                },
                transaction: t
            })

            if (req.body.payment_status) payment.payment_status = req.body.payment_status

            const update = await payment.save({ transaction: t });

            if (update && cart) {
                if (cart.page_id) {
                    const page = await Page.findOne({
                        where: {
                            fb_page_id: cart.page_id
                        }
                    })

                    if (page && cart.buyer_recipient_id) {
                        await sendMessage({
                            accessToken: encryption.decrypt(page.page_token).data,
                            message: `Your payment status is ${payment.payment_status}`,
                            recipient_id: cart.buyer_recipient_id,
                        })
                    }
                }
            }

            return update
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
    uploadPaymentImage,
}