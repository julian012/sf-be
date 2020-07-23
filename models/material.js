'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Material.init({
    materialName: DataTypes.STRING,
    materialRegistryDate: DataTypes.DATE,
    materialQuantity: DataTypes.DOUBLE,
    materialAvaliable: DataTypes.DOUBLE,
    materialPrice: DataTypes.DOUBLE,
    userId: DataTypes.INTEGER,
    typeMaterialId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Material',
  });
  return Material;
};