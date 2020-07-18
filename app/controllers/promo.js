const flaverr = require('flaverr');
const save = async (req, res, next) => {
    try {
        const existPromo = await Promo.findOne({
            where: {
                promo_code: req.body.promo_code
            }
        })

        if (existPromo) throw flaverr('E_NOT_FOUND', Error(`promo code ${req.body.promo_code} is already exist`));

        let reduction_options = ['percentage', 'flat', 'delivery']
        let reduction_type = reduction_options[0]

        if (req.body.reduction_type === reduction_options[1]) reduction_type = req.body.reduction_type
        if (req.body.reduction_type === reduction_options[2]) reduction_type = req.body.reduction_type

        // checking max_discount, min_ammount, promo_discount can't be negative
        if (req.body.max_discount < 0) throw flaverr('E_NOT_FOUND', Error(`max_discount can't be negative`));
        if (req.body.min_ammount < 0) throw flaverr('E_NOT_FOUND', Error(`min_ammount can't be negative`));
        if (req.body.promo_discount < 0) throw flaverr('E_NOT_FOUND', Error(`promo_discount can't be negative`));

        const promo = {
            promo_name: req.body.promo_name,
            promo_code: req.body.promo_code,
            promo_discount: req.body.promo_discount,
            max_discount: req.body.max_discount,
            min_ammount: req.body.min_ammount,
            description: req.body.description,
            expired_at: req.body.expired_at,
            reduction_type: reduction_type,
            is_expired: false
        }

        const save = await Promo.create(promo);

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
        const promo = await Promo.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with id ${req.params.id} is not exist`));

        let reduction_options = ['percentage', 'flat', 'delivery']
        let reduction_type = reduction_options[0]

        if (req.body.reduction_type === reduction_options[1]) reduction_type = req.body.reduction_type
        if (req.body.reduction_type === reduction_options[2]) reduction_type = req.body.reduction_type

        // checking max_discount, min_ammount, promo_discount can't be negative
        if (req.body.max_discount < 0) throw flaverr('E_NOT_FOUND', Error(`max_discount can't be negative`));
        if (req.body.min_ammount < 0) throw flaverr('E_NOT_FOUND', Error(`min_ammount can't be negative`));
        if (req.body.promo_discount < 0) throw flaverr('E_NOT_FOUND', Error(`promo_discount can't be negative`));

        if (req.body.promo_name) promo.promo_name = req.body.promo_name
        if (req.body.promo_code) promo.promo_code = req.body.promo_code
        if (req.body.promo_discount) promo.promo_discount = req.body.promo_discount
        if (req.body.max_discount) promo.max_discount = req.body.max_discount
        if (req.body.min_ammount) promo.min_ammount = req.body.min_ammount
        if (req.body.description) promo.description = req.body.description
        if (req.body.expired_at) promo.expired_at = req.body.expired_at
        if (req.body.reduction_type) promo.reduction_type = reduction_type

        const update = await promo.save();

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
        const promo = await Promo.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with id ${req.params.id} is not exist`));

        const destroy = await promo.destroy();

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
        const promo = await Promo.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!promo) throw flaverr('E_NOT_FOUND', Error(`promo with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: promo
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
        if (req.query.promo_name) where.promo_name = { [Op.like]: `%${req.query.promo_name}%` }
        if (req.query.promo_code) where.promo_code = { [Op.like]: `%${req.query.promo_code}%` }
        // if (req.query.promo_discount) where.promo_discount = { [Op.like]: `%${req.query.promo_discount}%` }
        // if (req.query.max_discount) where.max_discount = { [Op.like]: `%${req.query.max_discount}%` }
        // if (req.query.start_min_ammount && req.query.end_min_ammount) {
        //     where.min_ammount = { [Op.between]: [req.query.start_min_ammount, req.query.end_min_ammount] }
        // }

        const { count, rows } = await Promo.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`promo not found`));

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

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll
}