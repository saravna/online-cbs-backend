'use strict';
module.exports = (sequelize, DataTypes) => {
  const orderItems = sequelize.define('orderItems', {
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  orderItems.associate = function(models) {
    orderItems.belongsTo(models.products)
  };
  return orderItems;
};