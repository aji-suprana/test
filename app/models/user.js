'use strict';
//TODO:
// ganti credit menjadi credit berdasarkan mata uang rupiah
// 100 credit = 100ribu rupiah

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username already registered',
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email already registered',
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_reset_token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password_expired_token: {
        type: DataTypes.DATE,
        allowNull: true
      },
      password_token_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      credit: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_verified'
      }
    },
    {
      paranoid: true,
      tableName: 'Users',
      timestamps: true,
      underscored: true,
    }
  );
  User.associate = function (models) {
    // associations can be defined here
    // User.belongsToMany(models.Brand, { through: 'BrandUser' });
    User.hasOne(models.Profile);
  };
  return User;
};
