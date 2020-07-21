'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    'Profile',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: {
          args: true,
          msg: 'User ID already registered',
        },
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      tableName: 'Profiles',
    }
  );
  Profile.associate = function (models) {
    // associations can be defined here
    Profile.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Profile;
};
