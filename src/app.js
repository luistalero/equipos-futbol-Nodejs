const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db');
require('./models/associations');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

const authRoutes = require('./routes/auth.routes');
const positionRoutes = require('./routes/position.routes');
const teamRoutes = require('./routes/team.routes');
const technicalDirectorRoutes = require('./routes/technicalDirector.routes');
const playerRoutes = require('./routes/player.routes'); 
const uploadRoutes = require('./routes/upload.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000; 

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:1640', 'http://localhost:5173', 'http://localhost:5174', 'https://equipos-futbol-nodejs-production.up.railway.app' ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true, 
    optionsSuccessStatus: 204 
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = 'public/uploads';
const staticPath = path.join(__dirname, '..', uploadDir)
app.use('/uploads', express.static(staticPath));

app.get('/api', (req, res) => {
    res.status(200).json({
        message: '¡Bienvenido a la API del Torneo de Fútbol!',
        environment: process.env.NODE_ENV || 'development',
        database_dialect: process.env.DB_DIALECT
    });
});

app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/technical-directors', technicalDirectorRoutes);
app.use('/api/players', playerRoutes); 
app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos de Sequelize sincronizados con la base de datos.');

        app.listen(PORT, () => {
            console.log('🔗 Sirviendo archivos estáticos desde:', staticPath);
            console.log(`🚀 Servidor Express funcionando en http://localhost:${PORT}`);
            console.log(`ℹ️ Accede a la API en http://localhost:${PORT}/api`);
            console.log(`📖 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error('Fatal error al iniciar la aplicación:', error);
        process.exit(1);
    }
};

startServer();