'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rekening_Bulan = sequelize.define(
    'Rekening_Bulan',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bulan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tahun: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sum_bulan: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
        allowNull: false,
      },
      next_bulan: {
        type: DataTypes.UUID,
        allowNull: true
      },
      previous_bulan: {
        type: DataTypes.UUID,
        allowNull: true
      },
      rekening_id: {
        type: DataTypes.UUID,
      },
      tahun_id: {
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
      tableName: 'Rekening_Bulans',
    }
  );
  Rekening_Bulan.associate = function (models) {
    // associations can be defined here
    Rekening_Bulan.belongsTo(models.Rekening_Bulan, {
      foreignKey: 'next_bulan',
      as: 'Next',
    });
    Rekening_Bulan.belongsTo(models.Rekening_Bulan, {
      foreignKey: 'previous_bulan',
      as: 'Previous',
    });
    Rekening_Bulan.belongsTo(models.Rekening, { foreignKey: 'rekening_id' });
    Rekening_Bulan.belongsTo(models.Rekening_Tahun, { foreignKey: 'tahun_id' });
    Rekening_Bulan.hasMany(models.Debit, { foreignKey: 'rekening_bulan_id' });
    Rekening_Bulan.hasMany(models.Credit, { foreignKey: 'rekening_bulan_id' });
  };
  return Rekening_Bulan;
};
