'use strict';
module.exports = (sequelize, DataTypes) => {
  const SessionDelivery = sequelize.define('SessionDelivery', {
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
    delivery_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'Delivery',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'session_deliveries',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  SessionDelivery.associate = function (models) {
    // associations can be defined here
  };
  return SessionDelivery;
};