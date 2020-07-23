'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ouvre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Ouvre.init({
    ouvreName: DataTypes.STRING,
    ouvreDirection: DataTypes.STRING,
    ouvreStartDate: DataTypes.DATE,
    ouvreEndDate: DataTypes.DATE,
    statusOuvre: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ouvre',
  });
  return Ouvre;
};