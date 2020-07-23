'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignachine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Assignachine.init({
    machineId: DataTypes.INTEGER,
    taskId: DataTypes.INTEGER,
    assignStartDate: DataTypes.DATE,
    assignEndDate: DataTypes.DATE,
    standbyPrice: DataTypes.DOUBLE,
    workerdHours: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Assignachine',
  });
  return Assignachine;
};