'use strict';
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define('order', {
    userId: DataTypes.INTEGER,
    status: DataTypes.ENUM(['PENDING','DELIVERED']),
    otp: DataTypes.INTEGER,
    recieptUrl : DataTypes.STRING,
    billAmount : DataTypes.INTEGER,
    paymentId : DataTypes.STRING
  }, {});
  order.associate = function(models) {
    order.hasOne(models.user)
    order.hasMany(models.orderItems)
  };
  return order;
};