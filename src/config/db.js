const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DIALECT = process.env.DB_DIALECT;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false, 
  dialectOptions: {

  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000; 

const connectDB = async (retries = 0) => {
  try {
    await sequelize.authenticate();
    console.log(`🎉 Conexión a la base de datos (${DB_DIALECT}) establecida con éxito.`);
  } catch (error) {
    console.error(`❌ No se pudo conectar a la base de datos (${DB_DIALECT}):`, error.message); 
    if (retries < MAX_RETRIES) {
      const nextRetry = retries + 1;
      console.log(`Intentando reconectar a la base de datos... Intento ${nextRetry}/${MAX_RETRIES} en ${RETRY_DELAY_MS / 1000} segundos.`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(nextRetry);
    } else {
      console.error('⚠️ Se agotaron los intentos de conexión a la base de datos. La aplicación no puede iniciar.');
      process.exit(1); 
    }
  }
};

module.exports = {
  sequelize,
  connectDB
};