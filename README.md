# Proyecto 6: Backend con Autenticación y Productos – DWFS

> API RESTful desarrollada con Node.js, Express y MongoDB para la gestión de usuarios autenticados y productos asociados.
Incluye autenticación y autorización mediante JWT, operaciones CRUD completas para productos y arquitectura modular profesional.
Proyecto desarrollado para el Módulo 6 del Bootcamp: Desarrollo Web Full Stack (UDD).

# Índice

- [Introducción general](#introducción-general)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Componentes principales](#componentes-principales)
- [Autentificación y autorización](#autentificacion-y-autorizacion)
- [Servicios CRUD de Producto](#servicios-crud-de-productos)
- [Documentación Swagger](#documentación-swagger)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Control de versiones](#control-de-versiones)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estado del proyecto](#estado-del-proyecto)
- [Resultados](#resultados-y-pruebas-de-endpoints)

# Introducción general

El proyecto Backend con Autenticación y Productos implementa una API que permite:
- Registrar y autenticar usuarios mediante JSON Web Tokens (JWT).
- Mantener sesiones sin estado (stateless authentication).
- Gestionar un recurso Producto asociado a cada usuario.
- Realizar operaciones CRUD completas sobre los productos.
- Proteger rutas mediante autorización y control de ownership.

La aplicación está construida siguiendo una arquitectura por capas, separando claramente responsabilidades y permitiendo su reutilización posterior en un proyecto frontend (Proyecto 7).

# Arquitectura del proyecto

La arquitectura del backend sigue buenas prácticas de desarrollo profesional:
- config/ → configuración de conexión a MongoDB.
- controllers/ → manejo de solicitudes HTTP y lógica de cada endpoint.
- models/ → definición de esquemas Mongoose (User, Product).
- routes/ → definición de rutas y vinculación con controladores.
- middleware/ → middlewares globales (auth, notFound, errorHandler).
- utils/ → helpers reutilizables (asyncHandler, response, validators).

Esta separación permite escalabilidad, mantenibilidad y testing claro.

# Componentes principales
### Express Server
Servidor HTTP encargado de:
- Registrar middlewares globales (cors, json, error handling).
- Montar rutas /api/user y /api/product.
- Gestionar errores y rutas inexistentes.

### Modelos (Mongoose)
- User
  - name
  - email (único)
  - password (hash bcrypt)

- Product
  - name
  - description
  - price
  - user (referencia al usuario creador)

Ambos modelos están relacionados mediante ObjectId.

### Controladores
Los controladores:
- Validan datos de entrada.
- Ejecutan la lógica de negocio.
- Devuelven respuestas estandarizadas:
```
{
  "ok": true,
  "message": "Descripción de la operación",
  "data": { ... }
}
```
Los errores siguen el formato:
```
{
  "ok": false,
  "message": "Descripción del error",
  "errors": null
}
```
# Autentificación y autorización
La API implementa autenticación basada en JWT:

### Flujo
1. El usuario se registra o inicia sesión.
2. El servidor genera un JWT firmado.
3. El cliente envía el token en cada request protegido:
```
Authorization: Bearer <token>
```
4. El middleware auth.middleware.js valida el token y expone req.user.

### Endpoints de Usuario
| Método | Endpoint                | Descripción                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/api/user/register`    | Registrar un nuevo usuario    |
| POST   | `/api/user/login`       | Iniciar sesión                |
| GET    | `/api/user/verifytoken` | Verificar token activo        |
| PUT    | `/api/user/update`      | Actualizar perfil del usuario |


# Servicios CRUD de Producto
Los productos están asociados a un usuario y cuentan con control de ownership:
- Solo el creador puede actualizar o eliminar su producto.

### Endpoints de Producto
| Método | Endpoint                   | Descripción                        |
| ------ | -------------------------- | ---------------------------------- |
| POST   | `/api/product/create`      | Crear un producto (auth)           |
| GET    | `/api/product/readall`     | Listar todos los productos         |
| GET    | `/api/product/readone/:id` | Obtener un producto por ID         |
| PUT    | `/api/product/update/:id`  | Actualizar producto (auth + owner) |
| DELETE | `/api/product/delete/:id`  | Eliminar producto (auth + owner)   |

# Documentación Swagger
La API está documentada bajo el estándar OpenAPI 3.0 y visualizada con Swagger UI.
- URL local: http://localhost:3000/api-docs
- URL en Render: https://proyecto-4-c20.onrender.com/api-docs/

<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/abf83775-8401-4396-87a4-3c492780a9e3" />

Desde esta interfaz se puede:
- Explorar todos los endpoints.
- Ver ejemplos de request/response.
- Ejecutar operaciones directamente desde el navegador.

# Estructura de carpetas
```
📁 proyecto6-DWFS
├── 📁 src
│   ├── 📁 config
│   │   └── db.js
│   ├── 📁 controllers
│   │   ├── user.controller.js
│   │   └── product.controller.js
│   ├── 📁 middleware
│   │   ├── auth.middleware.js
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   ├── 📁 models
│   │   ├── User.js
│   │   └── Product.js
│   ├── 📁 routes
│   │   ├── user.routes.js
│   │   └── product.routes.js
│   └── 📁 utils
│       ├── asyncHandler.js
│       ├── response.js
│       └── validators.js
├── 📄 .env
├── 📄 .gitignore
├── 📄 index.js
├── 📄 package.json
└── 📄 README.md
```
### Estructura en Visual Studio Code
<img width="249" height="744" alt="image" src="https://github.com/user-attachments/assets/5710cd99-2416-4638-b669-fdfb0ac4aa82" />

# Instalación y ejecución
### 1. Clonar el repositorio
```
git clone https://github.com/Joseeloo/Proyecto_6_C20.git
cd proyecto6-DWFS
```

### 2. Instalar dependencias
```
npm install
```

### 3. Configurar variables de entorno
> Crear un archivo .env a partir de .env.template:

```
PORT=5000
MONGODB_URI=<URI_MONGODB_ATLAS>
JWT_SECRET=<CLAVE_SECRETA>
JWT_EXPIRES_IN=1h
CORS_ORIGIN=*
```

### 4. Ejecutar el proyecto
Modo desarrollo:
```
npm run dev
```

Modo producción:
```
npm run start
```

### 5. Acceder a la API **(CAMBIAR)
- API base: http://localhost:3000/api/reservas
- Swagger Docs: http://localhost:3000/api-docs

# Control de versiones
- Repositorio individual:
```
https://github.com/Joseeloo/Proyecto_6_C20
```
- Flujo de commits limpio (init, swagger, fix, deploy, etc.).
- .gitignore configurado para excluir node_modules/ y variables sensibles (.env).

# Tecnologías utilizadas
| Categoría            | Herramienta   |
| -------------------- | ------------- |
| Lenguaje             | JavaScript    |
| Entorno              | Node.js       |
| Framework            | Express       |
| Base de datos        | MongoDB Atlas |
| ORM                  | Mongoose      |
| Autenticación        | JWT           |
| Seguridad            | bcrypt        |
| Utilidades           | dotenv, cors  |
| Control de versiones | Git + GitHub  |


# Estado del proyecto
Cumple con todos los requisitos mínimos y entregables:
| Criterio                 | Estado                 |
| ------------------------ | ---------------------- |
| Proyecto individual      | ✅                      |
| Arquitectura clara       | ✅                      |
| Autenticación JWT        | ✅                      |
| CRUD Productos           | ✅                      |
| Autorización (ownership) | ✅                      |
| Manejo de errores global | ✅                      |
| Swagger                  | ⏳ Pendiente (opcional) |
| Despliegue Render        | ⏳ Pendiente (opcional) |
| Despliegue            |    ✅   | [Render](https://proyecto-4-c20.onrender.com/api-docs/)                   |

# Resultados y Pruebas de Endpoints
Esta sección presenta los resultados de las pruebas realizadas sobre la API, demostrando el correcto funcionamiento de los endpoints solicitados en el enunciado del Proyecto 6.

Las pruebas fueron ejecutadas utilizando Thunder Client, verificando:
- correcta respuesta HTTP
- formato de respuesta estándar
- funcionamiento de autenticación y autorización
- validación de errores esperados

### 1. Verificación del servidor (Health Check)

**Método:** GET

**Endpoint:**
```
http://localhost:3000/
```

<img width="1478" height="408" alt="image" src="https://github.com/user-attachments/assets/ae43c210-ac30-4f67-829b-857b341f32f8" />

### 2. Registro de usuario

**Método:** POST

**Endpoint:**
```
http://localhost:3000/api/user/register

```

**Body (JSON):**
```
{
  "name": "Tester1",
  "email": "Tester1@test.com",
  "password": "12345678"
}
```

<img width="1482" height="567" alt="image" src="https://github.com/user-attachments/assets/5e2826fb-0aaf-4140-885d-d1a94c94269b" />

<img width="1480" height="567" alt="image" src="https://github.com/user-attachments/assets/89520020-a0a7-453e-9df4-2da97e0a702f" />


### 3. Inicio de sesión de usuario

**Método:** POST

**Endpoint:**
```
http://localhost:3000/api/user/login

```

**Body (JSON):**
```
{
  "email": "Tester1@test.com",
  "password": "12345678"
}
```
<img width="1476" height="566" alt="image" src="https://github.com/user-attachments/assets/35926eee-89b2-4e87-86d7-2e9c550caca3" />

<img width="1478" height="566" alt="image" src="https://github.com/user-attachments/assets/8f7e4c43-0741-4bb1-87bb-a5195f6acffe" />

### 4. Verificación de token activo

**Método:** GET

**Endpoint:**
```
http://localhost:3000/api/user/verifytoken

```

**Headers:**
```
Authorization: Bearer <TOKEN_JWT>
```

<img width="1476" height="568" alt="image" src="https://github.com/user-attachments/assets/55bb8c0f-a09a-4dd2-b72f-ab19d78698a3" />

### 5. Creación de producto (usuario autenticado)

**Método:** POST

**Endpoint:**
```
http://localhost:3000/api/product/create
```

**Headers:**
```
Authorization: Bearer <TOKEN_JWT>
```

**Body (JSON):**
```
{
  "name": "Producto de prueba",
  "description": "Producto creado desde Thunder Client",
  "price": 1000
}
```

<img width="1482" height="569" alt="image" src="https://github.com/user-attachments/assets/3a77c020-b600-4ecf-9fbe-1247e458c808" />

<img width="1478" height="561" alt="image" src="https://github.com/user-attachments/assets/efb1a364-9e8d-483e-a956-abce1280c796" />

### 6. Listar todos los productos

**Método:** GET

**Endpoint:**
```
http://localhost:3000/api/product/readall
```

<img width="1471" height="566" alt="image" src="https://github.com/user-attachments/assets/d13d606b-11fe-4345-93db-eefa6be61f21" />

### 7. Obtener producto específico por ID

**Método:** GET

**Endpoint:**
```
http://localhost:3000/api/product/readone/<ID_PRODUCTO>
```

<img width="1477" height="566" alt="image" src="https://github.com/user-attachments/assets/649c3c7b-dca2-456d-b504-3bede81c3bed" />

<img width="1481" height="566" alt="image" src="https://github.com/user-attachments/assets/3e60cb27-895e-49b0-b090-f22dc6580af3" />

### 8. Actualizar producto (control de ownership)

**Método:** PUT

**Endpoint:**
```
http://localhost:3000/api/product/update/<ID_PRODUCTO>
```

**Headers:**
```
Authorization: Bearer <TOKEN_JWT>
```

**Body (JSON):**
```
{
  "price": 1500
}
```

<img width="1485" height="570" alt="image" src="https://github.com/user-attachments/assets/b8286d12-41ae-4202-a759-6c90fdbb08cf" />

<img width="1482" height="568" alt="image" src="https://github.com/user-attachments/assets/fcf69407-910c-4ad0-97e7-0ec32530153e" />

### 9. Eliminación de producto

**Método:** DELETE

**Endpoint:**
```
http://localhost:3000/api/product/delete/<ID_PRODUCTO>
```

<img width="1475" height="564" alt="image" src="https://github.com/user-attachments/assets/f3182cce-db9f-4732-8fa3-e5e2b3e4abd0" />

<img width="1474" height="559" alt="image" src="https://github.com/user-attachments/assets/0548ff14-73bf-40e7-8cea-bc1193d1f277" />

<img width="1481" height="562" alt="image" src="https://github.com/user-attachments/assets/d12ab1cb-1433-422d-bb2c-dd659d55fd33" />

### 10. Manejo de errores esperados

**Ejemplo: acceso sin token**

**Método:** POST

**Endpoint:**
```
http://localhost:3000/api/product/create

```

<img width="1484" height="569" alt="image" src="https://github.com/user-attachments/assets/b9cf6227-0586-4ac5-89f2-e0383b0cc950" />

### Conclusión de pruebas
Las pruebas realizadas demuestran que la aplicación:
- Implementa correctamente autenticación y autorización con JWT
- Cumple con todas las operaciones CRUD solicitadas
- Maneja adecuadamente errores y validaciones
- Responde con formatos estándar y códigos HTTP correctos

Esto valida el cumplimiento de los requisitos funcionales del Proyecto 6.

### Despliegue en Render
La API se encuentra desplegada y funcionando en la nube a través de **Render.com**.

**Enlace base:** 
- [https://proyecto-4-c20.onrender.com](https://proyecto-4-c20.onrender.com) (CAMBIAR)

**Documentación Swagger:**  
- [https://proyecto-4-c20.onrender.com/api-docs](https://proyecto-4-c20.onrender.com/api-docs) (CAMBIAR)

> Puedes probar los endpoints directamente desde la interfaz Swagger sin necesidad de Postman o Thunder Client.


---

**Autor:** José Esteban  
**Fecha de entrega:** 10-11-2025
