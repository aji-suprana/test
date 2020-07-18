'use strict';
module.exports = (sequelize, DataTypes) => {
  const Promo = sequelize.define('Promo', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    promo_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    promo_code: {
      allowNull: false,
      type: DataTypes.STRING
    },
    promo_discount: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    max_discount: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    min_ammount: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    description: {
      type: DataTypes.TEXT('tiny')
    },
    reduction_type: {
      defaultValue: 'precentage',
      type: DataTypes.STRING
    },
    expired_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    is_expired: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'promos',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Promo.associate = function (models) {
    // associations can be defined here
    Promo.hasMany(models.Checkout, { foreignKey: 'promo_id' });
  };
  return Promo;
};