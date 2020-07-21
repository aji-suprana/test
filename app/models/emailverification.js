'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmailVerification = sequelize.define('EmailVerification', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
    	type: DataTypes.UUID,
    },
    verif_code: {
    	type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    }
  }, {
    paranoid: true,
  	timestamps: true,
    underscored: true,
    tableName: 'EmailVerifications',
  });
  EmailVerification.associate = function(models) {
    // associations can be defined here
    EmailVerification.belongsTo(models.User);
  };
  return EmailVerification;
};