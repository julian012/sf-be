import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const TypeMaterial = sequelize.define('TypeMaterials', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      typeMaterialName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      measurement: {
        type: DataTypes.STRING,
        allowNull: false
      }
  }, {
    freezeTableName: true
  }
)

export default TypeMaterial