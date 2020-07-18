'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cart_id: {
        type: DataTypes.UUID,
      },
      user_id: {
        type: DataTypes.UUID,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: 'tags',
    }
  );
  Tag.associate = function (models) {
    // associations can be defined here
    Tag.belongsTo(models.Cart, { foreignKey: 'cart_id' });
    Tag.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Tag;
};
