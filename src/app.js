// futbol-node/src/server.js
const express = require('express');
const cors = require('cors'); // Para manejar las políticas de CORS
const path = require('path'); // Para manejar rutas de archivos y directorios
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// Importaciones de configuración y modelos de la base de datos
const { connectDB, sequelize } = require('./config/db');
require('./models/associations'); // Asegura que se carguen las asociaciones entre modelos

// Importaciones para Swagger (documentación de la API)
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

// Importar los archivos de rutas de tu API
const authRoutes = require('./routes/auth.routes');
const positionRoutes = require('./routes/position.routes');
const teamRoutes = require('./routes/team.routes');
const technicalDirectorRoutes = require('./routes/technicalDirector.routes');
const playerRoutes = require('./routes/player.routes'); 
const uploadRoutes = require('./routes/upload.routes');

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Define el puerto, tomando de .env o 3000 por defecto

// --- Middlewares Globales ---

// Configuración explícita de CORS para permitir solicitudes desde los orígenes de Swagger UI
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:1640', 'http://localhost:5173'], // Permite peticiones desde estos dominios
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Permite el envío de credenciales (ej. cookies, headers de autorización)
    optionsSuccessStatus: 204 // Para las solicitudes preflight OPTIONS
};
app.use(cors(corsOptions)); // Aplica el middleware CORS con las opciones definidas

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());
// Middleware para parsear el cuerpo de las peticiones en formato URL-encoded
app.use(express.urlencoded({ extended: true }));

// Configurar el directorio para servir archivos estáticos (ej. imágenes subidas)
const uploadDir = 'public/uploads'; // Directorio de subidas (relativo a la raíz del proyecto)
// Sirve los archivos estáticos desde /uploads (ej. http://localhost:3000/uploads/imagen.jpg)
// path.join(__dirname, '..', uploadDir) construye la ruta absoluta: futbol-node/public/uploads
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// --- Rutas de la API ---

// Ruta de prueba básica para verificar que la API está funcionando
app.get('/api', (req, res) => {
    res.status(200).json({
        message: '¡Bienvenido a la API del Torneo de Fútbol!',
        environment: process.env.NODE_ENV || 'development',
        database_dialect: process.env.DB_DIALECT
    });
});

app.use('/api', uploadRoutes);
// Montar las rutas de autenticación bajo el prefijo /api/auth
app.use('/api/auth', authRoutes);
// Montar las rutas de posiciones bajo el prefijo /api/positions
app.use('/api/positions', positionRoutes);
// Montar las rutas de equipos bajo el prefijo /api/teams
app.use('/api/teams', teamRoutes);
// Montar las rutas de directores técnicos bajo el prefijo /api/technical-directors
app.use('/api/technical-directors', technicalDirectorRoutes);
app.use('/api/players', playerRoutes); 

// --- Configuración de la Documentación Swagger UI ---
// Monta Swagger UI en la ruta /api-docs.
// swaggerUi.serve maneja los archivos estáticos de Swagger UI,
// swaggerUi.setup(swaggerSpec) inicializa la interfaz con tu especificación.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Función asíncrona para conectar a la DB y levantar el servidor
const startServer = async () => {
    try {
        await connectDB(); // Intenta conectar a la base de datos

        // Sincroniza los modelos de Sequelize con la base de datos.
        // { alter: true } intenta realizar cambios no destructivos en la DB para que coincida con los modelos.
        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos de Sequelize sincronizados con la base de datos.');

        // Inicia el servidor Express en el puerto definido
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express funcionando en http://localhost:${PORT}`);
            console.log(`ℹ️ Accede a la API en http://localhost:${PORT}/api`);
            console.log(`📖 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        // Si hay un error fatal al iniciar (ej. no se puede conectar a la DB), lo loguea y sale del proceso
        console.error('Fatal error al iniciar la aplicación:', error);
        process.exit(1);
    }
};

// Llama a la función para iniciar el servidor
startServer();