const { success } = require('../services/httpRes');

const aliasRepository = require('../repositories/alias');

const CreateNewAlias = async (req, res, next) => {
  try {
    const { nama_general, stok_min } = req.body;
    const aliasData = { nama_general, stok_min };

    const alias = await aliasRepository.Create(aliasData);

    if (!alias.status) {
      throw alias.err;
    }

    return success(res, 201, alias.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllAliases = async (req, res, next) => {
  try {
    const { nama_general, stok_min, page, per_page } = req.query;
    const params = { nama_general, stok_min };
    const pagination = { page, per_page };

    const aliases = await aliasRepository.FindMany(params, pagination);

    if (!aliases.status) {
      throw aliases.err;
    }

    return success(res, 200, aliases.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneAlias = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alias = await aliasRepository.FindOne(id);

    if (!alias.status) {
      throw alias.err;
    }

    return success(res, 200, alias.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateNewAlias,
  FindAllAliases,
  FindOneAlias,
};
