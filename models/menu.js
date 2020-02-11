'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define('menu', {
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  menu.associate = function(models) {
    
  };
  return menu;
};