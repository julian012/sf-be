import { DataTypes, INET }  from "sequelize";
import { sequelize } from "../src/database";

const AssignMaterial = sequelize.define('AssignMaterial', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      ouvreId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantityUsed: {
        type: DataTypes.DOUBLE,
        allowNull: false
      }
  }, {
    freezeTableName: true
  }
)

export default AssignMaterial