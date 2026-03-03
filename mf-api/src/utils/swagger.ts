import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mini Feeds API Documentation',
            version: '1.0.0',
            description: 'API Documentation for the Mini Feeds social media platform.',
            contact: {
                name: 'Developer Support',
            },
        },
        servers: [
            {
                url: '/api/v1',
                description: 'Current server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        process.env.NODE_ENV === 'production'
            ? './dist/routes/*.js'
            : './src/routes/*.ts',
        process.env.NODE_ENV === 'production'
            ? './dist/app/routes.js'
            : './src/app/routes.ts'
    ], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
