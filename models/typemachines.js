import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const TypeMachines = sequelize.define('TypeMachines', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    nameTypeMachine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machineHourValue: DataTypes.DOUBLE
  }, {
    freezeTableName: true
  }
)

export default TypeMachines