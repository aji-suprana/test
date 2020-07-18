'use strict';
module.exports = (sequelize, DataTypes) => {
  const Buyer = sequelize.define('Buyer', {
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
      // unique: {
      //   args: true,
      //   msg: 'Email already in use!'
      // },
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
    }
  }, {
    indexes: [
      {
        unique: true,
        // fields: ['email']
        fields: ['fb_id']
      }
    ],
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'buyers',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Buyer.associate = function (models) {
    // associations can be defined here
    Buyer.hasOne(models.Checkout, {
      foreignKey: 'buyer_id'
    })
  };
  return Buyer;
};