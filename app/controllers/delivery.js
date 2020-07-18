const flaverr = require('flaverr');
const debug = require('../services/debug')
const save = async (req, res, next) => {
    try {
        const existedDelivery = await Delivery.findOne({
            where: {
                name: req.body.name,
                delivery_fee: req.body.delivery_fee,
                delivery_time: req.body.delivery_time,
                user_id : req.user.userData.id
            }
        });

        if(existedDelivery)
        {
            return res.status(500).json({
                status:'failed',
                message: "same delivery existed"
            })
        }
        debug.logHeader("creating delivery")
        // checking fee n time, can't be negative
        if (req.body.delivery_fee < 0) throw flaverr('E_NOT_FOUND', Error(`delivery fee can't be negative`));
        if (req.body.delivery_time < 0) throw flaverr('E_NOT_FOUND', Error(`delivery time can't be negative`));

        const delivery = {
            name: req.body.name,
            delivery_fee: req.body.delivery_fee,
            delivery_time: req.body.delivery_time,
            user_id : req.user.userData.id
        }

        const save = await Delivery.create(delivery);
        debug.logData("new delivery created",save.toJSON() )
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
        const delivery = await Delivery.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!delivery) throw flaverr('E_NOT_FOUND', Error(`delivery with id ${req.params.id} is not exist`));

        // checking fee n time, can't be negative
        if (req.body.delivery_fee < 0) throw flaverr('E_NOT_FOUND', Error(`delivery fee can't be negative`));
        if (req.body.delivery_time < 0) throw flaverr('E_NOT_FOUND', Error(`delivery time can't be negative`));

        if (req.body.name) delivery.name = req.body.name
        if (req.body.delivery_fee) delivery.delivery_fee = req.body.delivery_fee
        if (req.body.delivery_time) delivery.delivery_time = req.body.delivery_time

        const update = await delivery.save();

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
        const delivery = await Delivery.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!delivery) throw flaverr('E_NOT_FOUND', Error(`delivery with id ${req.params.id} is not exist`));

        const destroy = await delivery.destroy();

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
        const delivery = await Delivery.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!delivery) throw flaverr('E_NOT_FOUND', Error(`delivery with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: delivery
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
        const where = 
        {
            user_id : req.user.userData.id
        }
        if (req.query.name) where.name = { [Op.like]: `%${req.query.name}%` }
        if (req.query.start_price && req.query.end_price) {
            where.delivery_fee = { [Op.between]: [req.query.start_price, req.query.end_price] }
        }

        let allData;

        if (req.query.user_id) {
            allData = await Delivery.findAndCountAll({
                offset: (req.query.page - 1) * req.query.per_page,
                limit: req.query.per_page,
                where: where,
                include: [{
                    model: Session,
                    as: 'session_deliveries',
                    where: {
                        user_id: { [Op.like]: `%${req.query.user_id}%` }
                    }
                }]
            });
        } else {
            allData = await Delivery.findAndCountAll({
                offset: (req.query.page - 1) * req.query.per_page,
                limit: req.query.per_page,
                where: where,
                include: [{
                    model: Session,
                    as: 'session_deliveries'
                }]
            });
        }

        const { count, rows } = allData;

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`delivery not found`));

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
const getDeliveryFromSession = async (req, res, next) => {
    try {
        const session = await Session.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Delivery,
                as: 'session_deliveries'
            }]
        });

        if (!session) throw flaverr('E_NOT_FOUND', Error(`session with id ${req.params.id} is not exist`));
        
        const delivery = session.session_deliveries;

        return res.status(200).json({
            status: 'success',
            data: delivery
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

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll,
    getDeliveryFromSession
}