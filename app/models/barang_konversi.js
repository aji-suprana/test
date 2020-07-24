'use strict';
module.exports = (sequelize, DataTypes) => {
  const Barang_Konversi = sequelize.define(
    'Barang_Konversi',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nama_konversi: {
        type: DataTypes.STRING,
      },
      barang_id: {
        type: DataTypes.UUID,
      },
      konversi_id: {
        type: DataTypes.UUID,
      },
      barcode_satuan_lain: {
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
      tableName: 'Barang_Konversis',
    }
  );
  Barang_Konversi.associate = function (models) {
    // associations can be defined here
    Barang_Konversi.belongsTo(models.Barang, { foreignKey: 'barang_id' });
    Barang_Konversi.belongsTo(models.Konversi, { foreignKey: 'konversi_id' });
  };
  return Barang_Konversi;
};
