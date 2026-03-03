import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { notFoundMiddleware, errorHandlerMiddleware } from './error';
import middleware from './middleware';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../utils/swagger';
import http from 'http';

const app = express();
const server = http.createServer(app);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply general middleware
app.use(middleware);

// Load routes after attaching io
app.use(routes);

// Error handling middleware
app.use(errorHandlerMiddleware);
app.use('/', notFoundMiddleware);

export { server, app };