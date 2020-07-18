const flaverr = require('flaverr');
const debug = require('../services/debug')
const encryption = require('../services/encryption')
const save = async (req, res, next) => {
    debug.logHeader('Creating Business')
    debug.log(req.body)
    try {
        const user = await User.findOne({
            where: {
                id: req.user.userData.id
            }
        });

        debug.log("user", user)

        if (!user) {
            debug.error(`user with id ${req.user.userData.id} is not exist, please login and take the token`)
            throw flaverr('E_NOT_FOUND', Error(`user with id ${req.user.userData.id} is not exist, please login and take the token`));
        }


        const existBusiness = await Business.findOne({
            where: {
                user_id: user.id
            }
        })

        debug.log("existBusiness", existBusiness);

        if (existBusiness) {
            debug.error(`you just allowed to create 1 business profile`)
            throw flaverr('E_NOT_FOUND', Error(`you just allowed to create 1 business profile`));
        }

        // checking streaming_estimate can't be negative
        if (req.body.streaming_estimate < 0) {
            debug.error(`streaming_estimate can't be negative`)
            throw flaverr('E_NOT_FOUND', Error(`streaming_estimate can't be negative`))
        };

        const business = {
            name: req.body.name,
            business_name: req.body.business_name,
            business_description: req.body.business_description,
            description_of_products: req.body.description_of_products,
            streaming_estimate: req.body.streaming_estimate,
            business_address: req.body.business_address,
            mobile_number: req.body.mobile_number,
            email: req.body.email,
            username: req.body.username,
            password: encryption.encrypt(req.body.password).data,
            user_id: user.id,
            contact_link: req.body.contact_link,
            merchant_id: req.body.merchant_id
        }
        debug.log("businessInfo", business);
        const save = await Business.create(business);

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
        const business = await Business.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!business) throw flaverr('E_NOT_FOUND', Error(`business with id ${req.params.id} is not exist`));

        // checking streaming_estimate can't be negative
        if (req.body.streaming_estimate < 0) throw flaverr('E_NOT_FOUND', Error(`streaming_estimate can't be negative`));

        if (req.body.name) business.name = req.body.name
        if (req.body.business_name) business.business_name = req.body.business_name
        if (req.body.business_description) business.business_description = req.body.business_description
        if (req.body.streaming_estimate) business.streaming_estimate = req.body.streaming_estimate
        if (req.body.business_address) business.business_address = req.body.business_address
        if (req.body.description_of_products) business.description_of_products = req.body.description_of_products
        if (req.body.mobile_number) business.mobile_number = req.body.mobile_number
        if (req.body.contact_link) business.contact_link = req.body.contact_link
        if (req.body.email) business.email = req.body.email

        const save = await business.save();

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
        const business = await Business.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!business) throw flaverr('E_NOT_FOUND', Error(`business with id ${req.params.id} is not exist`));

        const destroy = await business.destroy();

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
        const business = await Business.findOne({
            where: {
                id: req.params.id
            }, include: [{
                model: User
            }]
        });

        if (!business) throw flaverr('E_NOT_FOUND', Error(`business with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: business
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

const findCurrent = async (req, res, next) => {
    debug.logHeader("Find Current Business")
    try {
        const user = await User.findOne({
            where: {
                id: req.user.userData.id
            }
        });

        debug.log("user", user)

        if (!user) {
            debug.error(`user with id ${req.user.userData.id} is not exist, please login and take the token`)
            throw flaverr('E_NOT_FOUND', Error(`user with id ${req.user.userData.id} is not exist, please login and take the token`));
        }

        const existBusiness = await Business.findOne({
            where: {
                user_id: user.id
            }
        })

        debug.log("existBusiness", existBusiness);

        if (existBusiness) {
            return res.status(200).json({
                status: 'success',
                data: existBusiness
            });
        }

        return res.status(500).json({
            status: 'failed',
            data: 'INVALID_BUSINESS_INFO'
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
        if (req.query.business_name) where.business_name = { [Op.like]: `%${req.query.business_name}%` }
        if (req.query.business_description) where.business_description = { [Op.like]: `%${req.query.business_description}%` }
        if (req.query.user_id) where.user_id = { [Op.eq]: req.query.user_id }
        if (req.query.start_hour && req.query.end_hour) {
            where.streaming_estimate = { [Op.between]: [req.query.start_hour, req.query.end_hour] }
        }

        const { count, rows } = await Business.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: { user_id: req.query.user_id },
            include: [{
                model: User
            }]
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`businesss not found`));

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

module.exports = {
    save,
    destroy,
    update,
    findById,
    findAll,
    findCurrent
}