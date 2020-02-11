'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image : DataTypes.STRING
  }, {});
  products.associate = function(models) {
    products.hasOne(models.menu)
  };
  return products;
};