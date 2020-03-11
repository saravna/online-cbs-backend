'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    mail: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    mobile : DataTypes.STRING,
    blocked : DataTypes.BOOLEAN
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};