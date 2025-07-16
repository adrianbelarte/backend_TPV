# 🧾 TPV Hostelería – Backend

Backend para un sistema de Punto de Venta (TPV) enfocado en eventos, fiestas o discomóviles. Diseñado para funcionar **offline** mediante una base de datos **SQLite local**, con autenticación por roles, gestión de productos, tickets y reportes de ventas.

---

## 🚀 Tecnologías

- **Node.js** + **Express.js**
- **SQLite** (persistencia local)
- **Sequelize** (ORM)
- **JWT** (autenticación)
- **Swagger** (documentación API)
- **Jest** + **Supertest** (testing opcional)

---

## 📁 Estructura del Proyecto


/backend
├── /src
│ ├── /controllers
│ ├── /models
│ ├── /routes
│ ├── /middlewares
│ ├── /services
│ ├── /utils
│ ├── /tests
│ └── app.js
├── /config
│ └── config.json
├── /docs ← Documentación Swagger
├── /migrations ← Migraciones Sequelize
├── /seeders ← Datos iniciales (opcional)
├── .env
├── database.sqlite ← Base de datos local
├── package.json
└── README.md

📦 2. Instalar dependencias principales
npm install express sequelize sqlite3 dotenv jsonwebtoken
npm install cors


🛠️ 3. Instalar dependencias de desarrollo
npm install --save-dev nodemon sequelize-cli jest supertest


4. Configurar y crear base de datos

npx sequelize-cli db:migrate

📌 Comandos útiles
npm run dev        # Ejecuta el servidor en modo desarrollo (nodemon)
npm start          # Ejecuta en producción
npm test           # Ejecuta los tests (opcional)

📖 Documentación API
Se genera con Swagger (archivo disponible en /docs/swagger.json).

Puedes acceder a Swagger UI en:
📍 http://localhost:3000/api-docs

📦 Generar Backup (manual)

database.sqlite → USB / nube / carpeta externa

✍️ Autor
Desarrollado por [Adrian Belarte Zapata].
Contacto: [adrian.belarte.it@gmail.com]

