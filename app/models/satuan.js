'use strict';
module.exports = (sequelize, DataTypes) => {
  const Satuan = sequelize.define(
    'Satuan',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nama_satuan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Nama Satuan already registered',
        },
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: 'Satuans',
    }
  );
  Satuan.associate = function (models) {
    // associations can be defined here
    Satuan.hasOne(models.Konversi, { foreignKey: 'satuan_tujuan' });
    Satuan.hasOne(models.Konversi, { foreignKey: 'satuan_asal' });
    Satuan.hasMany(models.Barang, { foreignKey: 'satuan_id' });
  };
  return Satuan;
};
