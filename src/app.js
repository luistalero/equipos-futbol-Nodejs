const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); 
const WebSocket = require('ws');
const jwt = require('jsonwebtoken'); 
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
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); 

const userConnections = new Map();

wss.on('connection', ws => {
    console.log('Cliente conectado via WebSocket');

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'auth' && data.token) {
                const decodedToken = jwt.decode(data.token);
                if (decodedToken && decodedToken.id) {
                    userConnections.set(decodedToken.id, ws);
                    console.log(`Usuario ID: ${decodedToken.id} registrado en WebSocket.`);
                }
            }
        } catch (error) {
            console.error('Error al procesar el mensaje del WebSocket:', error);
        }
    });

    ws.on('close', () => {
        for (const [userId, connection] of userConnections.entries()) {
            if (connection === ws) {
                userConnections.delete(userId);
                console.log(`Usuario ID: ${userId} desconectado.`);
                break;
            }
        }
    });
});

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:1640', 'http://localhost:5173', 'http://localhost:5174', 'https://equipos-futbol-reactjs-production.up.railway.app' ], 
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

app.post('/webhook/n8n', (req, res) => {
    const data = req.body;
    console.log('Datos recibidos del webhook:', data);
    res.status(200).send('Webhook recibido con éxito.');
  });
  
app.post('/api/auth/suspend', (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ message: 'El ID de usuario es requerido.' });
    }
    
    const ws = userConnections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'user-status', status: 'suspended' }));
        res.status(200).json({ message: 'Señal de suspensión enviada.' });
    } else {
        res.status(404).json({ message: 'Usuario no conectado o no encontrado.' });
    }
});

const PORT =  process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        console.log('🔄 Modelos de Sequelize sincronizados con la base de datos.');

        server.listen(PORT, () => {
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
