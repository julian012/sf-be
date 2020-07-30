import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const Material = sequelize.define('Materials', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  materialName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  materialRegistryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  materialQuantity: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  materialAvaliable: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  materialPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
   typeMaterialId: {
     type: DataTypes.INTEGER,
     allowNull: false
   }
}, {
freezeTableName: true
})

export default Material;