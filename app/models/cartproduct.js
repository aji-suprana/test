'use strict';
module.exports = (sequelize, DataTypes) => {
  const CartSessionProduct = sequelize.define('CartProduct', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    cart_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'Cart',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER
    }
  }, { 
    timestamps: true,
    underscored: true,
    tableName: 'cart_products' ,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  CartSessionProduct.associate = function(models) {
    // associations can be defined here
    CartSessionProduct.belongsTo(models.Cart, {
      foreignKey: 'cart_id'
    });

    CartSessionProduct.belongsTo(models.Product, {
      foreignKey: 'product_id'
    });
  };
  return CartSessionProduct;
};