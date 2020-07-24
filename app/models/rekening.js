'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rekening = sequelize.define(
    'Rekening',
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
      nomor_rekening: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_rekening_id: {
        type: DataTypes.INTEGER,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Rekenings',
      charset: 'utf8'
    }
  );
  Rekening.associate = function (models) {
    // associations can be defined here
    Rekening.belongsTo(models.Jenis_Rekening, {
      foreignKey: 'jenis_rekening_id',
    });
    Rekening.hasMany(models.Debit, { foreignKey: 'rekening_id' });
    Rekening.hasMany(models.Credit, { foreignKey: 'rekening_id' });
    Rekening.hasOne(models.Rekening_Tahun, { foreignKey: 'rekening_id' });
    Rekening.hasOne(models.Rekening_Bulan, { foreignKey: 'rekening_id' });
  };
  return Rekening;
};
