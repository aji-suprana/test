const flaverr = require('flaverr');
const save = async (req, res, next) => {
    try {
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }

        const save = await User.create(user);

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
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id ${req.params.id} is not exist`));

        if (req.body.first_name) user.first_name = req.body.first_name
        if (req.body.last_name) user.last_name = req.body.last_name
        if (req.body.email) user.email = req.body.email

        const save = await user.save();

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
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id ${req.params.id} is not exist`));

        const destroy = await user.destroy();

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
        const user = await User.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Product
            }, {
                model: Business
            }]
        });

        if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: user
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
        if (req.query.first_name) where.first_name = { [Op.like]: `%${req.query.first_name}%` }
        if (req.query.last_name) where.last_name = { [Op.like]: `%${req.query.last_name}%` }
        if (req.query.email) where.email = { [Op.like]: `%${req.query.email}%` }

        const { count, rows } = await User.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where,
            include: [{
                model: Product
            }, {
                model: Business
            }]
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`user not found`));

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
    findAll
}