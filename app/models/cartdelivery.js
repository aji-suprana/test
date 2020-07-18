'use strict';
module.exports = (sequelize, DataTypes) => {
  const CartDelivery = sequelize.define(
    'CartDelivery',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      cart_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: 'Cart',
          key: 'id',
        },
      },
      delivery_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: 'Delivery',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'cart_deliveries',
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  );
  CartDelivery.associate = function (models) {
    // associations can be defined here
    CartDelivery.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
    });

    CartDelivery.belongsTo(models.Delivery, {
      foreignKey: 'delivery_id',
    });
  };
  return CartDelivery;
};
