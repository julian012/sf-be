import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const Ouvre = sequelize.define('Tasks', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    taskDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    taskStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    taskEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    taskState: {
      type: DataTypes.ENUM(['FINISHED', 'CANCELLED', 'DOING']),
      allowNull: false
    },
    ouvreId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
}, {
  freezeTableName: true
})

export default Ouvre;  