'use strict';
module.exports = (sequelize, DataTypes) => {
  const Barang = sequelize.define(
    'Barang',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nama_barang: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kode_barang: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipe_barang: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      satuan_id: {
        type: DataTypes.UUID,
      },
      kategori_barang_id: {
        type: DataTypes.UUID,
      },
      rekening_persediaan: {
        type: DataTypes.UUID,
      },
      rekening_hpp: {
        type: DataTypes.UUID,
      },
      alias_id: {
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
      tableName: 'Barangs',
    }
  );
  Barang.associate = function (models) {
    // associations can be defined here
    Barang.belongsTo(models.Kategori_Barang, {
      foreignKey: 'kategori_barang_id',
    });
    Barang.belongsTo(models.Alias, { foreignKey: 'alias_id' });
    Barang.belongsTo(models.Satuan, { foreignKey: 'satuan_id' });
    Barang.hasMany(models.Barang_Supplier, { foreignKey: 'barang_id' });
    Barang.hasMany(models.Harga_Jual, { foreignKey: 'barang_id' });
    Barang.hasMany(models.Barang_JenisBarang, { foreignKey: 'barang_id' });
    Barang.hasMany(models.Barang_Konversi, { foreignKey: 'barang_id' });
  };
  return Barang;
};
