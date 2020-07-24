'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jenis_Barang = sequelize.define(
    'Jenis_Barang',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Nama already registered',
        },
      },
      kode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Kode already registered',
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
      tableName: 'Jenis_Barangs',
    }
  );
  Jenis_Barang.associate = function (models) {
    // associations can be defined here
    Jenis_Barang.hasMany(models.Barang_JenisBarang, {
      foreignKey: 'jenis_barang_id',
    });
    Jenis_Barang.hasMany(models.Jenis_Barang_Relasi, {
      foreignKey: 'induk_id',
      as: 'Anak',
    });
    Jenis_Barang.hasMany(models.Jenis_Barang_Relasi, {
      foreignKey: 'anak_id',
      as: 'Induk',
    });
  };
  return Jenis_Barang;
};
