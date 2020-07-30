import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const AssingMachines = sequelize.define('AssignMachines', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    machineId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assignStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    assignEndDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    standbyPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    workerdHours: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
}, {
  freezeTableName: true
})

export default AssingMachines