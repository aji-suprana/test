'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    merchant_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    order_id: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    invoice_no: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    currency: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    amount: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    payment_status: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    request_timestamp: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    session_id: {
      allowNull: true,
      type: DataTypes.UUID
    },
    cart_id: {
      allowNull: true,
      type: DataTypes.UUID
    },
    user_id: {
      allowNull: true,
      type: DataTypes.UUID
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'payments',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Payment.associate = function (models) {
    // associations can be defined here
    Payment.belongsTo(models.Cart, { foreignKey: 'cart_id' });

    Payment.belongsTo(models.Session, {
      foreignKey: 'session_id'
    });
  };
  return Payment;
};