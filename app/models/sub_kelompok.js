'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sub_Kelompok = sequelize.define(
    'Sub_Kelompok',
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
      nomor_sub_kelompok: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kelompok_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Sub_Kelompoks',
      charset: 'utf8'
    }
  );
  Sub_Kelompok.associate = function (models) {
    // associations can be defined here
    Sub_Kelompok.belongsTo(models.Kelompok, { foreignKey: 'kelompok_id' });
    Sub_Kelompok.hasMany(models.Jenis_Rekening, {
      foreignKey: 'sub_kelompok_id',
    });
  };
  return Sub_Kelompok;
};
