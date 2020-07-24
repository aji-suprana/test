'use strict';
module.exports = (sequelize, DataTypes) => {
  const Alias = sequelize.define(
    'Alias',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nama_general: {
        type: DataTypes.STRING,
      },
      stok_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: 'Aliases',
    }
  );
  Alias.associate = function (models) {
    // associations can be defined here
    Alias.hasMany(models.Barang, { foreignKey: 'alias_id' });
  };
  return Alias;
};
