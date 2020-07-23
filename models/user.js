import { DataTypes }  from "sequelize";
import { sequelize } from "../src/database";

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    docType: {
        type: DataTypes.ENUM(['CC', 'NIT']),
        allowNull: false,
        defaultValue: 'CC'
    },
    userNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userRol: {
        type: DataTypes.ENUM(['ADMIN', 'WORKER', 'PROVIDER', 'DIRECTOR']),
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userMail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true
})

export default User;
