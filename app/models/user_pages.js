'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_pages = sequelize.define('User_pages', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    page_fb_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_fb_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    seller_recipient_id: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'user_pages',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  User_pages.associate = function (models) {
    // associations can be defined here
  };
  return User_pages;
};