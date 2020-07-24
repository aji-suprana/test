'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jenis_Harga_Jual = sequelize.define(
    'Jenis_Harga_Jual',
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
        unique: {
          args: true,
          msg: 'Nama already registered',
        },
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: 'Jenis_Harga_Juals',
    }
  );
  Jenis_Harga_Jual.associate = function (models) {
    // associations can be defined here
    Jenis_Harga_Jual.hasMany(models.Harga_Jual, {
      foreignKey: 'harga_jual_id',
    });
  };
  return Jenis_Harga_Jual;
};
