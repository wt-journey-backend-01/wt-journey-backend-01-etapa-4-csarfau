import knexConfig from '../knexfile.js';
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const config = knexConfig[nodeEnv];
export const db = knex(config);
