import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const databaseConfig = {
	connectionString: process.env.DATABASE_URL,
};

const connection = new Pool(databaseConfig);

export default connection;
