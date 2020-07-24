'use strict';
module.exports = (sequelize, DataTypes) => {
  const Barang_Supplier = sequelize.define(
    'Barang_Supplier',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      barang_id: {
        type: DataTypes.UUID,
      },
      supplier_id: {
        type: DataTypes.UUID,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: 'Barang_Suppliers',
    }
  );
  Barang_Supplier.associate = function (models) {
    // associations can be defined here
    Barang_Supplier.belongsTo(models.Barang, { foreignKey: 'barang_id' });
  };
  return Barang_Supplier;
};
