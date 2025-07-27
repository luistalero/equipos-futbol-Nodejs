// src/utils/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  // La propiedad 'definition' contiene la información principal de OpenAPI.
  definition: {
    openapi: '3.0.0', // Versión de OpenAPI
    info: {
      title: 'API Torneo de Fútbol',
      version: '1.0.0',
      description: 'API RESTful para la gestión de un torneo de fútbol, permitiendo registrar y administrar equipos, jugadores y directores técnicos.',
      contact: {
        name: 'Luis Talero',
        email: 'luis.talero@wiedii.co'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local (Sin Docker)'
      },
      {
        url: 'http://localhost:1640/api',
        description: 'Servidor local (Docker)'
      }
    ],
    // Componentes reutilizables: esquemas, respuestas, seguridad
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce tu token JWT aquí (ej. Bearer eyJ...)'
        }
      },
      schemas: {
        // Definición del esquema para el modelo Position
        Position: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID auto-generado de la posición.',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Nombre de la posición.',
              example: 'Delantero'
            }
          },
          required: ['name']
        },
        // Aquí añadirás otros schemas como Team, Player, User (si los necesitas para Swagger)
        // User: { ... }
      },
      responses: {
        UnauthorizedError: {
          description: 'Acceso no autorizado. Token no válido o expirado.',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Fallo al autenticar el token.'
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Acceso denegado. Se requiere rol de administrador.',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Acceso denegado. Se requiere rol de administrador.'
                  }
                }
              }
            }
          }
        }
      }
    },
    // Seguridad global aplicada a todas las rutas por defecto
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 'apis' define dónde buscar las tags y paths (desde archivos YAML o JSDoc).
  // Aquí apuntamos a los archivos YAML que contienen solo las rutas.
  apis: [
    path.resolve(__dirname, '../swagger/auth.yaml'),         // Rutas de autenticación
    path.resolve(__dirname, '../swagger/positions.yaml'),    // Rutas de posiciones
    path.resolve(__dirname, '../swagger/teams.yaml'),        // Rutas de equipos
    path.resolve(__dirname, '../swagger/technicalDirectors.yaml'), // Rutas de directores técnicos
    path.resolve(__dirname, '../swagger/players.yaml'),      // <-- ¡NUEVA LÍNEA AÑADIDA! Rutas de jugadores
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;