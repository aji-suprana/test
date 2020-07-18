'use strict';
module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
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
    fb_page_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    page_token: {
      allowNull: false,
      type: DataTypes.STRING(1024),
    },
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'pages',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Page.associate = function (models) {
    // associations can be defined here
  };
  return Page;
};