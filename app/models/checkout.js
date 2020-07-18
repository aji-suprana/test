'use strict';
module.exports = (sequelize, DataTypes) => {
  const Checkout = sequelize.define('Checkout', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    promo_id: {
      allowNull: true,
      type: DataTypes.UUID
    },
    cart_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    user_id: {
      allowNull: true,
      type: DataTypes.UUID
    },
    session_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    purchase_amount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    delivery_fee: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    buyer_id: {
      type: DataTypes.UUID,
      required: true
    },
    buyer_fb_id: {
      type: DataTypes.STRING,
      required: true
    },
    buyer_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_country: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_region: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_zip_code: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_phone: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'checkouts',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Checkout.associate = function (models) {
    // associations can be defined here
    Checkout.belongsTo(models.Cart, {
      foreignKey: 'cart_id'
    });
    Checkout.belongsTo(models.Buyer, {
      foreignKey: 'buyer_id'
    });
    Checkout.belongsTo(models.Promo, {
      foreignKey: 'promo_id'
    });
    Checkout.belongsTo(models.Session, {
      foreignKey: 'session_id'
    });
    Checkout.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  return Checkout;
};