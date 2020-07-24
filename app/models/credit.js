'use strict';
module.exports = (sequelize, DataTypes) => {
  const Credit = sequelize.define(
    'Credit',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nominal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      jurnal_umum_id: {
        type: DataTypes.UUID,
      },
      rekening_bulan_id: {
        type: DataTypes.UUID,
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
      tableName: 'Credits',
    }
  );
  Credit.associate = function (models) {
    // associations can be defined here
    Credit.belongsTo(models.Rekening, { foreignKey: 'rekening_id' });
    Credit.belongsTo(models.Jurnal_Umum, { foreignKey: 'jurnal_umum_id' });
    Credit.belongsTo(models.Rekening_Bulan, { foreignKey: 'rekening_bulan_id' });
  };
  return Credit;
};
