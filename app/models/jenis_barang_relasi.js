'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jenis_Barang_Relasi = sequelize.define(
    'Jenis_Barang_Relasi',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      induk_id: {
        type: DataTypes.UUID,
      },
      anak_id: {
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
      tableName: 'Jenis_Barang_Relasis',
    }
  );
  Jenis_Barang_Relasi.associate = function (models) {
    // associations can be defined here
    Jenis_Barang_Relasi.belongsTo(models.Jenis_Barang, {
      foreignKey: 'induk_id',
      as: 'Anak',
    });
    Jenis_Barang_Relasi.belongsTo(models.Jenis_Barang, {
      foreignKey: 'anak_id',
      as: 'Induk',
    });
  };
  return Jenis_Barang_Relasi;
};
