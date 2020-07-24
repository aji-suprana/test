'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hutang = sequelize.define(
    'Hutang',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tanggal_jatuh_tempo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      modul: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomor_invoice: {
        type: DataTypes.TEXT,
        unique: {
          args: true,
          msg: 'Nomor Invoice already exist',
        },
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Piutangs',
    }
  );
  Hutang.associate = function (models) {
    // associations can be defined here
    // Hutang.hasOne(models.Credit, { foreignKey: 'hutang_id' });
  };
  return Hutang;
};
