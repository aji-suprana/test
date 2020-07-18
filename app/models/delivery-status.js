'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeliveryStatus = sequelize.define('DeliveryStatus', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    delivery_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    delivery_status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: "Unkown"
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'delivery_statuses',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  DeliveryStatus.associate = function (models) {
    // associations can be defined here
    DeliveryStatus.belongsTo(models.Delivery, {
      foreignKey: 'delivery_id'
    });
  };
  return DeliveryStatus;
};