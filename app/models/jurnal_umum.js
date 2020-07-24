'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jurnal_Umum = sequelize.define(
    'Jurnal_Umum',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tanggal: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nomor_invoice: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Nomor Invoice already exist',
        },
      },
      selisih_debet_kredit_total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      modul: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['nomor_invoice']
        }
      ],
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Jurnal_Umums',
    }
  );
  Jurnal_Umum.associate = function (models) {
    // associations can be defined here
    Jurnal_Umum.hasMany(models.Debit, { foreignKey: 'jurnal_umum_id' });
    Jurnal_Umum.hasMany(models.Credit, { foreignKey: 'jurnal_umum_id' });
  };
  return Jurnal_Umum;
};
