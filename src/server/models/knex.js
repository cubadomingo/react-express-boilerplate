import knex from 'knex';
import dotenv from 'dotenv';
import knexfile from '../../knexfile';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

export default knex(config);
