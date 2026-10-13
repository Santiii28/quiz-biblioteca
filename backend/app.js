const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const libroRoutes = require('./routes/libroRoutes');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS: Angular corre en http://localhost:4200 (otro origen que la API)
app.use(cors({ origin: 'http://localhost:4200' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Biblioteca',
      version: '1.0.0',
      description: 'API REST para listar, crear y eliminar libros.'
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      schemas: {
        Libro: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Cien años de soledad' },
            autor: { type: 'string', example: 'Gabriel García Márquez' }
          }
        },
        NuevoLibro: {
          type: 'object',
          required: ['titulo', 'autor'],
          properties: {
            titulo: { type: 'string', example: 'Don Quijote' },
            autor: { type: 'string', example: 'Miguel de Cervantes' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            mensaje: { type: 'string', example: 'El título y el autor son obligatorios.' }
          }
        }
      }
    }
  },
  // Ruta absoluta: así Swagger encuentra los comentarios aunque se ejecute desde otra carpeta
  apis: [path.join(__dirname, 'routes', '*.js')]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use('/', libroRoutes);

// Si el cliente manda un JSON mal escrito, responder 400 en JSON (no una página HTML)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido.' });
  }
  console.error(err);
  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Swagger:  http://localhost:${PORT}/api-docs`);
});
