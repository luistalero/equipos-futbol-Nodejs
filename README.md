# API Torneo de Fútbol

Este proyecto implementa una API RESTful para la gestión de un torneo de fútbol, permitiendo registrar y administrar equipos, jugadores y directores técnicos. La aplicación está desarrollada con Node.js y Express.js, utilizando MariaDB como base de datos y Docker para la contenerización.

---

## 🚀 Características Principales

* **API RESTful Completa:** CRUD (Crear, Leer, Actualizar, Eliminar) para equipos y jugadores.
* **Autenticación y Autorización (JWT):** Acceso seguro a las rutas de la API mediante JSON Web Tokens.
* **Protección de Rutas:** Acceso a módulos y funcionalidades restringido a usuarios autenticados.
* **Contenerización con Docker:** La aplicación y la base de datos se ejecutan en contenedores Docker para facilitar el despliegue y la consistencia del entorno.
* **Base de Datos MariaDB:** Almacenamiento persistente de datos del torneo.
* **Manejo de Archivos:** Carga y visualización de fotos para logos de equipos y fotos de jugadores.
* **Carga Masiva de Equipos:** Endpoint para registrar múltiples equipos y sus jugadores a partir de un archivo `.xlsx`.
* **Documentación Interactiva (Swagger/OpenAPI):** Visualización y prueba de los endpoints de la API.
* **Arquitectura MVC:** Separación clara de responsabilidades entre Modelos, Vistas (respuestas API) y Controladores.
* **Uso de Middlewares:** Gestión de lógica transversal como autenticación y manejo de errores.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Base de Datos:** MariaDB
* **Contenerización:** Docker, Docker Compose
* **Autenticación:** JSON Web Tokens (JWT), bcryptjs
* **Manejo de Archivos:** Multer, exceljs
* **ORM:** Sequelize
* **Documentación API:** Swagger-UI-Express, Swagger-JSDoc
* **Variables de Entorno:** dotenv
* **Utilidades:** cors

---

## 📦 Estructura del Proyecto

```Bash
├── .env                  # Variables de entorno (NO DEBE SUBIRSE A GIT)
├── .dockerignore         # Archivos a ignorar por Docker al construir la imagen
├── Dockerfile            # Configuración para construir la imagen Docker de la aplicación
├── docker-compose.yml    # Orquestación de servicios (aplicación y base de datos)
├── package.json          # Dependencias y scripts del proyecto
├── README.md             # Este archivo
└── src/
        ├── app.js            # Punto de entrada principal de la aplicación
        ├── config/           # Configuraciones generales (DB, JWT)
        ├── controllers/      # Lógica de negocio de la API (manejan las solicitudes)
        ├── middlewares/      # Funciones middleware (autenticación, errores)
        ├── models/           # Modelos de base de datos (interacción con MariaDB)
        ├── routes/           # Definición de las rutas de la API
        ├── services/         # Lógica de negocio reutilizable (opcional)
        └── utils/            # Utilidades y configuración de Swagger
        ├── public/
        └── uploads/          # Directorio para almacenar las imágenes subidas
```

## ⚙️ Configuración y Ejecución

Sigue estos pasos para poner en marcha la aplicación.

### 1. Requisitos Previos

Asegúrate de tener instalado en tu sistema:
* [**Docker Desktop**](https://www.docker.com/products/docker-desktop) (incluye Docker Compose)

### 2. Configuración de Variables de Entorno

Crea un archivo llamado `.env` en la **raíz de tu proyecto** con el siguiente contenido. **¡Asegúrate de reemplazar los valores de ejemplo con tus propias contraseñas y secretos fuertes!**

```env

# Configuración del servidor
PORT=3000

# Configuración de la base de datos MariaDB
DB_HOST=mariadb
DB_USER=torneo_user
DB_PASSWORD=your_db_password_here
DB_NAME=torneo_futbol
DB_ROOT_PASSWORD=your_root_password_here

# Secreto para JSON Web Tokens (JWT)
JWT_SECRET=a_very_secret_key_for_jwt_that_is_long_and_random

# Rutas para archivos subidos
UPLOAD_DIR=public/uploads

```

## 3. Construir y Levantar los Contenedores Docker
Desde la raíz de tu proyecto, ejecuta el siguiente comando:

```Bash
docker-compose up --build -d
```

- --build: Fuerza la reconstrucción de las imágenes (útil la primera vez y después de cambios en Dockerfile).

- -d: Ejecuta los contenedores en modo "detached" (en segundo plano).

## 4. Acceder a la API
Una vez que los contenedores estén levantados, la API estará accesible en:

URL Base:```http://localhost:1640/api```

Documentación Swagger: ```http://localhost:1640/api-docs```

## 🔑 Autenticación (JWT)
Para interactuar con la mayoría de los endpoints de la API, necesitarás un token JWT.

1. Registro de Usuario: POST /api/auth/register

- Cuerpo:
  ```json
    {
        "username": "tu_usuario",
        "password": "tu_contraseña"
    }
  ```

2. Inicio de Sesión: POST /api/auth/login

- Cuerpo:
  ```json
    {
        "username": "tu_usuario",
        "password": "tu_contraseña"
    }
  ```

- Respuesta:
  ```json
    {
        "token": "eyJ..."
    }
  ```
   (Usa este token en el encabezado Authorization: Bearer <token> para las rutas protegidas).
## 💡 Endpoints Clave
(Esta sección se completará a medida que desarrollemos los controladores y las rutas.)
```Bash
Equipos:

POST /api/teams

GET /api/teams

GET /api/teams/:id

PUT /api/teams/:id

DELETE /api/teams/:id
```
```Bash
Jugadores:

POST /api/players

GET /api/players

GET /api/players/:id

PUT /api/players/:id

DELETE /api/players/:id

GET /api/teams/:teamId/players

Carga de Archivos:

POST /api/upload/team-logo/:teamId

POST /api/upload/player-photo/:playerId

POST /api/upload/teams-from-excel (Para carga masiva)
```

## 🛑 Apagar los Contenedores
Para detener y eliminar los contenedores (y la red asociada), ejecuta:

```Bash
docker-compose down
docker-compose down -v
```
También eliminará el volumen db_data (perderás los datos de la base de datos). Útil para empezar de nuevo.
# Creado por Luis Talero