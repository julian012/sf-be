import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const Ouvre = sequelize.define('Ouvres', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      ouvreName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ouvreDirection: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ouvreStartDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      ouvreEndDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      statusOuvre: {
          type: DataTypes.ENUM(['FINISHED', 'CANCELLED', 'DOING']),
          allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  }, {
    freezeTableName: true
  }
)

export default Ouvre;