const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Configuration Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Transport System API',
        version: '1.0.0',
        description: 'Documentation de l\'API pour le système de gestion des transports publics',
    },
    servers: [
        {
            url: 'https://smartbus.emkatech.tn',
            description: 'Serveur local'
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: { // Make sure this matches the reference in the route
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    security: [
        {
            BearerAuth: [] // Applies globally
        }
    ]
};
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './controllers/*.js'] // Tous les fichiers de routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUI,
    swaggerSpec
};
