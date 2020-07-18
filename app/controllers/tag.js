const flaverr = require('flaverr');
const debug = require('../services/debug')
const save = async (req, res) => {
  debug.logHeader('creating tag');
  try {
    const { name, cart_id } = req.body;
    const user_id = req.user.userData.id;
    const data = { name, cart_id, user_id };

    const checkCart = await Cart.findOne({
      where: {
        id: cart_id,
      },
    });

    if (!checkCart) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`cart with id ${cart_id} is not exist`)
      );
    }

    const checkTag = await Tag.findOne({
      where: data,
    });

    if (checkTag) {
      throw flaverr(
        'E_DUPLICATE',
        Error(`tag with name ${name} and cart_id ${cart_id} is already exist`)
      );
    }

    const tag = await Tag.create(data);
    return res.status(201).json({
      status: 'success',
      data: tag,
    });
  } catch (err) {
    if (err.code === 'E_NOT_FOUND') {
      res.status(404);
    } else if (err.code === 'E_DUPLICATE') {
      res.status(400);
    } else {
      res.status(500);
    }

    return res.json({
      status: 'failed',
      message: err.message,
    });
  }
};

const findAll = async (req, res) => {
  try {
    debug.logHeader('Find all Tag in cart')
    const page = req.query.page || 1;
    const per_page = req.query.per_page || 20;
    const cart_id = req.query.cart_id;
    const user_id = req.user.userData.id;
    const name = req.query.name

    // params
    const where = {};
    where.user_id = { [Op.eq]: user_id };
    cart_id ? (where.cart_id = { [Op.eq]: cart_id }) : '';
    name ? (where.name = { [Op.eq]: name }) : '';

    debug.logData('where',where);
    const { count, rows } = await Tag.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      where: where,
      include: {
        model: Cart,
        attributes: { exclude: ['id'] },
      },
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('tag not found'));
    }

    const result = paginate({
      data: rows,
      count,
      page,
      per_page,
    });

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    if (err.code === 'E_NOT_FOUND') {
      res.status(404);
    } else {
      res.status(500);
    }

    return res.json({
      status: 'failed',
      message: err.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cart_id } = req.body;

    const checkCart = await Cart.findOne({
      where: {
        id: cart_id,
      },
    });

    if (!checkCart) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`cart with id ${cart_id} is not exist`)
      );
    }

    const user_id = req.user.userData.id;

    // params
    const where = {};
    where.id = { [Op.eq]: id };
    where.user_id = { [Op.eq]: user_id };

    const tag = await Tag.findOne({
      where: where,
    });

    if (!tag) {
      throw flaverr('E_NOT_FOUND', Error(`tag with id ${id} is not found`));
    }

    if (tag.name === name && tag.cart_id === cart_id) {
      throw flaverr(
        'E_DUPLICATE',
        Error(`tag with name ${name} and cart id ${cart_id} is already exist`)
      );
    }

    tag.name = name;
    tag.cart_id = cart_id;

    await tag.save();
    return res.status(201).json({
      status: 'success',
      data: tag,
    });
  } catch (err) {
    if (err.code === 'E_NOT_FOUND') {
      res.status(404);
    } else if (err.code === 'E_DUPLICATE') {
      res.status(400);
    } else {
      res.status(500);
    }

    return res.json({
      status: 'failed',
      message: err.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    debug.logHeader('Destroying');
    const { cart_id, name } = req.query;
    const user_id = req.user.userData.id;

    // params
    const where = {};
    where.cart_id = { [Op.eq]: cart_id };
    where.name = { [Op.eq]: name };
    where.user_id = { [Op.eq]: user_id };
    debug.logData('where',where)
    const tag = await Tag.findOne({
      where: where,
    });

    if (!tag) {
      throw flaverr('E_NOT_FOUND', Error(`tag with name ${name} is not exist`));
    }

    await tag.destroy();
    return res.status(201).json({
      status: 'success',
      data: tag,
    });
  } catch (err) {
    if (err.code === 'E_NOT_FOUND') {
      res.status(404);
    } else {
      res.status(500);
    }

    return res.json({
      status: 'failed',
      message: err.message,
    });
  }
};

module.exports = {
  save,
  findAll,
  update,
  destroy,
};
