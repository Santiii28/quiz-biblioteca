const express = require('express');
const router = express.Router();

// Datos en memoria (se reinician cada vez que se reinicia el servidor)
let libros = [
  { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez' },
  { id: 2, titulo: 'El principito', autor: 'Antoine de Saint-Exupéry' },
  { id: 3, titulo: '1984', autor: 'George Orwell' }
];

let siguienteId = 4;

// Vista EJS (extra, renderizada en el servidor)
router.get('/', (req, res) => {
  res.render('index', { libros });
});

/**
 * @openapi
 * /api/libros:
 *   get:
 *     summary: Devuelve la lista de libros
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
router.get('/api/libros', (req, res) => {
  res.status(200).json(libros);
});

/**
 * @openapi
 * /api/libros:
 *   post:
 *     summary: Crea un libro
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoLibro'
 *     responses:
 *       201:
 *         description: Libro creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       400:
 *         description: Falta el título o el autor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/api/libros', (req, res) => {
  // En Express 5, req.body es undefined si no llega cuerpo: por eso el "?? {}"
  const { titulo, autor } = req.body ?? {};
  const tituloLimpio = String(titulo ?? '').trim();
  const autorLimpio = String(autor ?? '').trim();

  if (!tituloLimpio || !autorLimpio) {
    return res.status(400).json({ mensaje: 'El título y el autor son obligatorios.' });
  }

  const nuevoLibro = { id: siguienteId++, titulo: tituloLimpio, autor: autorLimpio };
  libros.push(nuevoLibro);
  return res.status(201).json(nuevoLibro);
});

/**
 * @openapi
 * /api/libros/{id}:
 *   delete:
 *     summary: Elimina un libro por id
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Libro eliminado (sin contenido)
 *       404:
 *         description: Libro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/api/libros/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = libros.findIndex((libro) => libro.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Libro no encontrado.' });
  }

  libros.splice(indice, 1);
  return res.status(204).send();
});

module.exports = router;
