import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const Schedule = sequelize.define('Schedules', {
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        scheduleDate: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                const date = this.getDataValue('scheduleDate')
                return date.toISOString().split('T')[0]
            }
        }
    },{
    freezeTableName: true
    }
)

export default Schedule