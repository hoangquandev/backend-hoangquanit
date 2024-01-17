const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

// Define các options cho Swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'QUDE API Documentation',
            version: '1.0.0',
            description: 'API documentation for QUDE',
        },
        basePath: '/api',
    },
    apis: [path.resolve(__dirname, './routes/*.js')],
};

// Tạo Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
