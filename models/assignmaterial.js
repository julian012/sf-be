'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssignMaterial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AssignMaterial.init({
    ouvreId: DataTypes.INTEGER,
    materialId: DataTypes.INTEGER,
    quantityUsed: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'AssignMaterial',
  });
  return AssignMaterial;
};