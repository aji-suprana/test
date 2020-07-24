'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rekening_Tahun = sequelize.define(
    'Rekening_Tahun',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tahun: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      saldo_awal_tahun: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        allowNull: false,
      },
      sum_tahun: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        allowNull: false,
      },
      next_tahun: {
        type: DataTypes.UUID,
        allowNull: true
      },
      previous_tahun: {
        type: DataTypes.UUID,
        allowNull: true
      },
      rekening_id: {
        type: DataTypes.UUID,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Rekening_Tahuns',
    }
  );
  Rekening_Tahun.associate = function (models) {
    // associations can be defined here
    Rekening_Tahun.belongsTo(models.Rekening_Tahun, {
      foreignKey: 'next_tahun',
      as: 'Next',
    });
    Rekening_Tahun.belongsTo(models.Rekening_Tahun, {
      foreignKey: 'previous_tahun',
      as: 'Previous',
    });
    Rekening_Tahun.hasMany(models.Rekening_Bulan, { foreignKey: 'tahun_id' });
    Rekening_Tahun.belongsTo(models.Rekening, { foreignKey: 'rekening_id' });
  };
  return Rekening_Tahun;
};
