'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING,
      required: true,
      unique: {
        args: true,
        msg: 'Email already in use!'
      },
      validate: {
        isEmail: true
      }
    },
    access_token: {
      allowNull: false,
      type: DataTypes.TEXT('tiny'),
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'tokens',
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  Token.associate = function (models) {
    // associations can be defined here
  };
  return Token;
};