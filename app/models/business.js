'use strict';
module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
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
    business_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    business_description: {
      type: DataTypes.TEXT('long')
    },
    business_address: {
      allowNull: true,
      type: DataTypes.TEXT('tiny')
    },
    contact_link: {
      type: DataTypes.TEXT
    },
    description_of_products: {
      allowNull: true,
      type: DataTypes.TEXT('tiny')
    },
    mobile_number: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    streaming_estimate: {
      type: DataTypes.DOUBLE
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    merchant_id:{
      allowNull:true,
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'businesses',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Business.associate = function (models) {
    // associations can be defined here
    Business.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  return Business;
};