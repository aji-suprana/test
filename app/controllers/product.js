const flaverr = require('flaverr');
const save = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.userData.id
            }
        });

        if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id ${req.user.userData.id} is not exist, please login and take the token`));

        if (req.body.product_code.length > 15) throw flaverr('E_NOT_FOUND', Error(`product_code max length is 15 character`));

        const existProduct = await Product.findOne({
            where: {
                product_code: req.body.product_code,
                user_id: user.id
            }
        });

        if (existProduct) throw flaverr('E_NOT_FOUND', Error(`product with code ${req.body.product_code} is already exist`));

        // checking stock n price, can't be negative
        if (req.body.product_stock < 0) throw flaverr('E_NOT_FOUND', Error(`product stock can't be negative`));
        if (req.body.price < 0) throw flaverr('E_NOT_FOUND', Error(`product price can't be negative`));

        const product = {
            product_name: req.body.product_name,
            product_code: req.body.product_code,
            description: req.body.description,
            price: req.body.price,
            unit: req.body.unit,
            unit_measure: req.body.unit_measure,
            product_stock: req.body.product_stock,
            user_id: req.user.userData.id
        }

        const save = await Product.create(product);

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
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.params.id} is not exist`));

        // checking stock n price, can't be negative
        if (req.body.product_stock < 0) throw flaverr('E_NOT_FOUND', Error(`product stock can't be negative`));
        if (req.body.price < 0) throw flaverr('E_NOT_FOUND', Error(`product price can't be negative`));

        if (req.body.product_name) product.product_name = req.body.product_name
        if (req.body.unit_measure) product.unit_measure = req.body.unit_measure
        if (req.body.description) product.description = req.body.description
        if (req.body.price) product.price = req.body.price
        if (req.body.unit) product.unit = req.body.unit
        if (req.body.product_stock) product.product_stock = req.body.product_stock

        const save = await product.save();

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
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.params.id} is not exist`));

        const destroy = await product.destroy();

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
        const product = await Product.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: User
            }]
        });

        if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.params.id} is not exist`));

        return res.status(200).json({
            status: 'success',
            data: product
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
        if (req.query.product_name) where.product_name = { [Op.like]: `%${req.query.product_name}%` }
        if (req.query.product_code) where.product_code = { [Op.like]: `%${req.query.product_code}%` }
        if (req.query.description) where.description = { [Op.like]: `%${req.query.description}%` }
        if (req.query.user_id) where.user_id = { [Op.eq]: req.query.user_id }
        if (req.query.start_price && req.query.end_price) {
            where.price = { [Op.between]: [req.query.start_price, req.query.end_price] }
        }

        const { count, rows } = await Product.findAndCountAll({
            offset: (req.query.page - 1) * req.query.per_page,
            limit: req.query.per_page,
            where: where,
            include: [{
                model: User
            }]
        });

        if (count === 0) throw flaverr('E_NOT_FOUND', Error(`product not found`));

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

const addStock = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.params.id} is not exist`));

        let addProductStock = 1
        if (req.body.product_stock && req.body.product_stock > 1) addProductStock = req.body.product_stock

        product.product_stock += addProductStock

        if (product.product_stock < 0) throw flaverr('E_NOT_FOUND', Error(`product stock out of limit`));

        const save = await product.save();

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

const reduceStock = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!product) throw flaverr('E_NOT_FOUND', Error(`product with id ${req.params.id} is not exist`));

        let addProductStock = 1
        if (req.body.product_stock && req.body.product_stock > 1) addProductStock = req.body.product_stock

        product.product_stock -= addProductStock

        if (product.product_stock < 0) throw flaverr('E_NOT_FOUND', Error(`product stock out of limit`));

        const save = await product.save();

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

module.exports = {
    save,
    destroy,
    update,
    findById,
    findAll,
    addStock,
    reduceStock
}