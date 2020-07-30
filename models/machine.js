import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const Machine = sequelize.define('Machine', {
    id: {
      type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    machinePlate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    typeMachineId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
})

export default Machine