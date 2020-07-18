'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    buyer_fb_id: {
      type: DataTypes.STRING,
      required: true
    },
    name: {
      type: DataTypes.STRING,
      required: true
    },
    buyer_recipient_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    cart_status: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'ordered'
    },
    seller_recipient_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    page_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    order_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'carts',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Cart.associate = function (models) {
    // associations can be defined here
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Cart.belongsTo(models.Session, {
      foreignKey: 'session_id'
    });
    
    Cart.hasMany(models.CartProduct, {
      as: 'cart_products',
      foreignKey: 'cart_id'
    });

    Cart.hasOne(models.Checkout, {
      foreignKey: 'cart_id'
    });

    Cart.hasOne(models.Payment, {
      foreignKey: 'cart_id'
    });

    Cart.hasOne(models.CartDelivery, {
      foreignKey: 'cart_id'
    });

    Cart.hasMany(models.Tag, { foreignKey: 'cart_id'});
  };
  return Cart;
};