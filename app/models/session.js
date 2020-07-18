'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    session_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('tiny'),
      allowNull: true
    },
    cart_editable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    expired_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    is_expired: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'sessions',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Session.associate = function (models) {
    // associations can be defined here
    Session.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Session.belongsToMany(models.Product, {
      through: models.SessionProduct,
      as: 'session_products',
      foreignKey: 'session_id'
    });

    Session.belongsToMany(models.Delivery, {
      through: models.SessionDelivery,
      as: 'session_deliveries',
      foreignKey: 'session_id'
    });

    Session.belongsToMany(models.PaymentOption, {
      through: models.SessionPaymentOption,
      as: 'session_paymentoptions',
      foreignKey: 'session_id'
    });

    Session.hasMany(models.Cart, { foreignKey: 'session_id' });
    Session.hasMany(models.Payment, { foreignKey: 'session_id' });
    Session.hasMany(models.Checkout, { foreignKey: 'session_id' });
    Session.hasMany(models.Delivery, { foreignKey: 'session_id' });
  };
  return Session;
};