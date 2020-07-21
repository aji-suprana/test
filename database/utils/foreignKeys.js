const addForeignKeys = (queryInterface, Sequelize, tables = [], t) => {
  return tables.map((table) => {
    const [result] = table.column.map((column, index) => {
      const type = table.type ? Sequelize[table.type[index]] : Sequelize.UUID;

      return queryInterface.changeColumn(
        table.table,
        column,
        {
          type,
          references: {
            model: table.refTable[index],
          },
        },
        { transaction: t }
      );
    });
    return result;
  });
};

const removeForeignKeys = (queryInterface, tables = [], t) => {
  return tables.map(async (table) => {
    const foreignKeys = await queryInterface.getForeignKeysForTables([
      table.table,
    ]);

    const [output] = foreignKeys[table.table].map(async (name) => {
      return await queryInterface.removeConstraint(table.table, name, {
        transaction: t,
      });
    });
    return output;
  });
};

module.exports = { addForeignKeys, removeForeignKeys };
