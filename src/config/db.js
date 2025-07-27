const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga las variables de entorno desde .env

// Configuración de la base de datos obtenida de las variables de entorno
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT; // Puerto para conexiones locales (PostgreSQL)
const DB_DIALECT = process.env.DB_DIALECT; // 'postgres' para local, 'mariadb' para Docker

// Inicializar Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT, // Sequelize usará esto si está definido
  dialect: DB_DIALECT,
  logging: false, // Desactiva el logging de las consultas SQL en consola (opcional, puedes poner 'true' para depuración)
  dialectOptions: {
    // Opciones específicas del dialecto. Por ejemplo, para PostgreSQL si usas SSL.
    // Para MariaDB, esto podría estar vacío o tener opciones específicas si las necesitas.
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función para probar la conexión a la base de datos
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`🎉 Conexión a la base de datos (${DB_DIALECT}) establecida con éxito.`);
  } catch (error) {
    console.error(`❌ No se pudo conectar a la base de datos (${DB_DIALECT}):`, error);
    // En un entorno de producción, aquí podrías querer salir del proceso o intentar reconectar.
    process.exit(1); // Sale del proceso si no se puede conectar a la DB
  }
};

module.exports = {
  sequelize,
  connectDB
};