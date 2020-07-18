'use strict';
module.exports = (sequelize, DataTypes) => {
  const SessionPaymentOption = sequelize.define('SessionPaymentOption', {
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
    paymentoption_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'PaymentOption',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'session_paymentoptions',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  SessionPaymentOption.associate = function (models) {
    // associations can be defined here
  };
  return SessionPaymentOption;
};