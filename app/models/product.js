'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT('tiny'),
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    unit_measure: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    unit: {
      type: DataTypes.STRING
    },
    product_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    product_sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'products',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Product.hasMany(models.CartProduct, {
      as: 'cart_products',
      foreignKey: 'product_id'
    });

    Product.belongsToMany(models.Session, {
      through: models.SessionProduct,
      as: 'session_products',
      foreignKey: 'product_id'
    });
  };
  return Product;
};