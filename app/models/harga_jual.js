'use strict';
module.exports = (sequelize, DataTypes) => {
  const Harga_Jual = sequelize.define(
    'Harga_Jual',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      barang_id: {
        type: DataTypes.STRING,
      },
      qty_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      harga_jual: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      harga_jual_id: {
        type: DataTypes.UUID,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: 'Harga_Juals',
    }
  );
  Harga_Jual.associate = function (models) {
    // associations can be defined here
    Harga_Jual.belongsTo(models.Barang, { foreignKey: 'barang_id' });
    Harga_Jual.belongsTo(models.Jenis_Harga_Jual, {
      foreignKey: 'harga_jual_id',
    });
  };
  return Harga_Jual;
};
