const flaverr = require('flaverr');

/*
  cara pakai check local IDs
    1. masukkan id di array pertama, jadikan object dengan key yg sama
    2. masukkan model di array kedua, harus sama urutannya
    misal mau ngecek id person dan corporate
    [[{ id_person }, { id_corporate }], [Model Person, Model Corporate]
*/

const checkLocalIDs = async (ids, models) => {
  try {
    if (!Array.isArray(ids)) {
      throw flaverr('E_INVALID_IDS', Error('ids must be an array of ids'));
    }

    if (!Array.isArray(models)) {
      throw flaverr(
        'E_INVALID_MODELS',
        Error('models must be an array of models')
      );
    }

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
          `E_CHECK`,
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
