'use strict';
module.exports = (sequelize, DataTypes) => {
  const Kategori_Barang = sequelize.define(
    'Kategori_Barang',
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
      },
      kode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: 'Kategori_Barangs',
    }
  );
  Kategori_Barang.associate = function (models) {
    // associations can be defined here
    Kategori_Barang.hasMany(models.Barang, {
      foreignKey: 'kategori_barang_id',
    });
  };
  return Kategori_Barang;
};
