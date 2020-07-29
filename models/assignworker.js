import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const AssignWorker = sequelize.define('AssignWorkers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userId: {
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
      allowNull: true
    }
}, {
  freezeTableName: true
})

export default AssignWorker;  