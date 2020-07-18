'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      required: true
    },
    last_name: {
      type: DataTypes.STRING,
      required: true
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: {
        args: true,
        msg: 'Email already in use!'
      },
      validate: {
        isEmail: true
      }
    },
    fb_id: {
      type: DataTypes.STRING,
      required: true,
      unique: {
        args: true,
        msg: 'FB already in use!'
      }
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ],
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Product, { foreignKey: 'user_id' });
    User.hasMany(models.Session, { foreignKey: 'user_id' });
    User.hasMany(models.Cart, { foreignKey: 'user_id' });
    User.hasMany(models.Checkout, { foreignKey: 'user_id' });
    User.hasOne(models.Business, { foreignKey: 'user_id' });
    User.hasMany(models.Delivery, { foreignKey: 'user_id' });
    User.hasMany(models.Tag, { foreignKey: 'user_id' });
  };
  return User;
};