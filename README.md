# Quiz Servicios Web y Frontend - Biblioteca

Proyecto con dos carpetas separadas:

- `backend`: Express + EJS + API REST + CORS + Swagger/OpenAPI.
- `frontend`: Angular (sin framework de UI, CSS propio) consumiendo la API REST.

## Backend

```bash
cd backend
npm install
npm start
```

Abrir:
- EJS: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- API: http://localhost:3000/api/libros

## Frontend

Abrir otra terminal:

```bash
cd frontend
npm install
npm start
```

Abrir http://localhost:4200

## Endpoints requeridos

- `GET /api/libros` -> 200
- `POST /api/libros` -> 201; 400 si falta título o autor
- `DELETE /api/libros/:id` -> 204; 404 si no existe
