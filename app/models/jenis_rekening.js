'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jenis_Rekening = sequelize.define(
    'Jenis_Rekening',
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
      nomor_jenis_rekening: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sub_kelompok_id: {
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
      tableName: 'Jenis_Rekenings',
      charset: 'utf8'
    }
  );
  Jenis_Rekening.associate = function (models) {
    // associations can be defined here
    Jenis_Rekening.belongsTo(models.Sub_Kelompok, {
      foreignKey: 'sub_kelompok_id',
    });
    Jenis_Rekening.hasMany(models.Rekening, {
      foreignKey: 'jenis_rekening_id',
    });
  };
  return Jenis_Rekening;
};
