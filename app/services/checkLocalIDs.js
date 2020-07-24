const flaverr = require('flaverr');

/**
 * Check All ID in This Service
 * @param {Array} ids Array of Object of IDs. Example: [ { barang_id: 'value' } ]
 * @param {Array} models Array of Models. Example [ Barang_Model ]
 */

const checkLocalIDs = async (ids = [], models = []) => {
  if (!Array.isArray(ids)) {
    return flaverr('E_INVALID_IDS', Error('ids must be an array of ids'));
  }

  if (!Array.isArray(models)) {
    return flaverr(
      'E_INVALID_MODELS',
      Error('models must be an array of models')
    );
  }

  try {
    const output = ids.map(async (id, index) => {
      const [key] = Object.keys(id);
      const [value] = Object.values(id);

      const result = await models[index].findOne({
        where: {
          id: value,
        },
      });

      if (!result) {
        throw flaverr(
          `E_CHECK_${key.toUpperCase()}`,
          Error(
            `${key} with id ${value}, with model: ${models[index].name}, is not found`
          )
        );
      }

      return result;
    });

    await Promise.all(output);
    return {
      status: true,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = checkLocalIDs;
