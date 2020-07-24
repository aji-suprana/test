'use strict';
module.exports = (sequelize, DataTypes) => {
  const Konversi = sequelize.define(
    'Konversi',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      satuan_tujuan: {
        type: DataTypes.UUID,
      },
      satuan_asal: {
        type: DataTypes.UUID,
      },
      conversion_rate: {
        type: DataTypes.INTEGER,
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
      tableName: 'Konversis',
    }
  );
  Konversi.associate = function (models) {
    // associations can be defined here
    Konversi.hasOne(models.Barang_Konversi, { foreignKey: 'konversi_id' });
    Konversi.belongsTo(models.Satuan, {
      foreignKey: 'satuan_tujuan',
      as: 'SatuanTujuan',
    });
    Konversi.belongsTo(models.Satuan, {
      foreignKey: 'satuan_asal',
      as: 'SatuanAsal',
    });
  };
  return Konversi;
};
