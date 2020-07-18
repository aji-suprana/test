'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentOption = sequelize.define('PaymentOption', {
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
    user_id: {
      allowNull: true,
      type: DataTypes.UUID
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'paymentoptions',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  PaymentOption.associate = function (models) {
    // associations can be defined here
    PaymentOption.belongsToMany(models.Session, {
      through: models.SessionPaymentOption,
      as: 'session_paymentoptions',
      foreignKey: 'paymentoption_id'
    });
  };
  return PaymentOption;
};