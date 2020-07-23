'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeMachines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TypeMachines.init({
    nameTypeMachine: DataTypes.STRING,
    machineHourValue: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'TypeMachines',
  });
  return TypeMachines;
};