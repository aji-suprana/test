'use strict';
module.exports = (sequelize, DataTypes) => {
  const SessionProduct = sequelize.define('SessionProduct', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    session_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'Session',
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
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'session_products',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  SessionProduct.associate = function (models) {
    // associations can be defined here
  };
  return SessionProduct;
};