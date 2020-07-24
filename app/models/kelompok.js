'use strict';
module.exports = (sequelize, DataTypes) => {
  const Kelompok = sequelize.define(
    'Kelompok',
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
      nomor_kelompok: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      posisi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Kelompoks',
      charset: 'utf8'
    }
  );
  Kelompok.associate = function (models) {
    // associations can be defined here
    Kelompok.hasMany(models.Sub_Kelompok, { foreignKey: 'kelompok_id' });
  };
  return Kelompok;
};
