const { Sequelize } = require('sequelize');
import config from '../../config/config.json'

export const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password, 
    {
        host: config.development.host,
        dialect: 'postgres',
        logging: console.log,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

export default async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


