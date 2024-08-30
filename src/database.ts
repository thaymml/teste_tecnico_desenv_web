import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, 
});

export { sequelize };
