const flaverr = require('flaverr');
const save = async (req, res, next) => {
    try {
        const deliveryStatus = {
            delivery_id: req.body.delivery_id,
            delivery_status: req.body.delivery_status
        }

        const save = await DeliveryStatus.create(deliveryStatus);

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
        const deliveryStatus = await DeliveryStatus.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!deliveryStatus) throw flaverr('E_NOT_FOUND', Error(`delivery-status with id ${req.params.id} is not exist`));

        if (req.body.delivery_id) deliveryStatus.delivery_id = req.body.delivery_id
        if (req.body.delivery_status) deliveryStatus.delivery_status = req.body.delivery_status

        const update = await deliveryStatus.save();

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
        const deliveryStatus = await DeliveryStatus.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!deliveryStatus) throw flaverr('E_NOT_FOUND', Error(`delivery-status with id ${req.params.id} is not exist`));

        const destroy = await deliveryStatus.destroy();

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
        const deliveryStatus = await DeliveryStatus.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: Delivery
            }
        });

        if (!deliveryStatus) throw flaverr('E_NOT_FOUND', Error(`delivery-status with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: deliveryStatus
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
        if (req.query.delivery_status) where.delivery_status = { [Op.like]: `%${req.query.delivery_status}%` }
        if (req.query.delivery_id) where.delivery_id = { [Op.eq]: req.query.delivery_id }

        const { count, rows } = await DeliveryStatus.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where,
            include: {
                model: Delivery
            }
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`delivery-status not found`));

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