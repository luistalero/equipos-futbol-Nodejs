const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
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
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.resolve(__dirname, '../swagger/auth.yaml'),         
    path.resolve(__dirname, '../swagger/positions.yaml'),    
    path.resolve(__dirname, '../swagger/teams.yaml'),      
    path.resolve(__dirname, '../swagger/technicalDirectors.yaml'), 
    path.resolve(__dirname, '../swagger/players.yaml'),
    path.resolve(__dirname, '../swagger/upload.yaml'),
    path.resolve(__dirname, '../swagger/users.yaml'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;