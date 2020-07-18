const flaverr = require('flaverr');
const save = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.userData.id
            }
        });

        if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id ${req.user.userData.id} is not exist, please login and take the token`));

        const paymentOption = {
            name: req.body.name,
            user_id: user.id
        }

        const save = await PaymentOption.create(paymentOption);

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
const update = async (req, res, next) => {
    try {
        const paymentOption = await PaymentOption.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!paymentOption) throw flaverr('E_NOT_FOUND', Error(`payment-option with id ${req.params.id} is not exist`));

        if (req.body.name) paymentOption.name = req.body.name

        const update = await paymentOption.save();

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
const destroy = async (req, res, next) => {
    try {
        const paymentOption = await PaymentOption.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!paymentOption) throw flaverr('E_NOT_FOUND', Error(`payment-option with id ${req.params.id} is not exist`));

        const destroy = await paymentOption.destroy();

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
        const paymentOption = await PaymentOption.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!paymentOption) throw flaverr('E_NOT_FOUND', Error(`payment-option with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: paymentOption
        });
    } catch (err) {
        return res.status(500).json({
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
        if (req.query.name) where.name = { [Op.like]: `%${req.query.name}%` }
        if (req.query.user_id) where.user_id = { [Op.eq]: req.query.user_id }

        const { count, rows } = await PaymentOption.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`payment option not found`));

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

const getPaymentFromSession = async (req, res, next) => {
    console.log("retrieving payment options from session");
    try {
        console.log(req);
        const session = await Session.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: PaymentOption,
                as: 'session_paymentoptions'
            }]
        });

        if (!session) throw flaverr('E_NOT_FOUND', Error(`session with id ${req.params.id} is not exist`));
        const paymentOption = session.session_paymentoptions;

        return res.status(200).json({
            status: 'success',
            data: paymentOption
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
            .json({
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
    getPaymentFromSession
}