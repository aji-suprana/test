'use strict';
module.exports = (sequelize, DataTypes) => {
  const Barang_JenisBarang = sequelize.define(
    'Barang_JenisBarang',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      jenis_barang_id: {
        type: DataTypes.UUID,
      },
      barang_id: {
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
      tableName: 'Barang_JenisBarangs',
    }
  );
  Barang_JenisBarang.associate = function (models) {
    // associations can be defined here
    Barang_JenisBarang.belongsTo(models.Jenis_Barang, {
      foreignKey: 'jenis_barang_id',
    });
    Barang_JenisBarang.belongsTo(models.Barang, {
      foreignKey: 'barang_id',
    });
  };
  return Barang_JenisBarang;
};
