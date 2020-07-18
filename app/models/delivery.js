'use strict';
module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    delivery_fee: {
      allowNull: false,
      type: DataTypes.STRING
    },
    delivery_time: {
      allowNull: false,
      type: DataTypes.DOUBLE
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'deliveries',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Delivery.associate = function (models) {
    // associations can be defined here
    Delivery.hasOne(models.DeliveryStatus, { foreignKey: 'delivery_id' });
    
    Delivery.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Delivery.belongsToMany(models.Session, {
      through: models.SessionDelivery,
      as: 'session_deliveries',
      foreignKey: 'delivery_id'
    });
    
    Delivery.hasMany(models.CartDelivery, {
      foreignKey: 'delivery_id'
    });
  };
  return Delivery;
};