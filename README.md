# Marketplace Service API

[English](#english) | [Español](#español)

---

<a name="english"></a>

# 🇬🇧 English

## 📖 Description

**Marketplace Service API** is a complete REST API built with NestJS for managing a freelance services marketplace. It allows clients to post services, freelancers to submit proposals, and both parties to manage contracts through their lifecycle.

### Key Features

- 🔐 **JWT Authentication** - Secure login and token-based authentication
- 👥 **Role-based Access Control** - Three roles: Client, Freelancer, Admin
- 📝 **Service Management** - Clients can create and manage service requests
- 💼 **Proposal System** - Freelancers can submit proposals for services
- 📜 **Contract Workflow** - Automatic contract creation from accepted proposals
- 🚀 **Redis Caching** - Performance optimization for frequently accessed data
- 🛡️ **Rate Limiting** - Protection against abuse with throttling
- ✅ **Input Validation** - Automatic validation with class-validator

## 🛠️ Tech Stack

- **Framework:** NestJS 11
- **Language:** TypeScript
- **Database:** MySQL 8.0
- **ORM:** TypeORM
- **Cache:** Redis
- **Authentication:** Passport JWT
- **Validation:** class-validator

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0
- Redis 7+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Boris-Espinosa/Marketplace-Service-Nest.git
cd marketplace-service

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with:
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=marketplace
REDIS_URL=redis://localhost:6379
JWT_PASSWORD=your_jwt_secret
REFRESH_JWT_PASSWORD=your_refresh_secret
```

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication

#### Register User

```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer {token}
```

#### Refresh Token

```http
POST /auth/refresh
Authorization: Bearer {refreshToken}
```

### Users

#### Get All Users (Admin only)

```http
GET /users
Authorization: Bearer {token}
```

#### Get User by Email (Admin only)

```http
GET /users/:email
Authorization: Bearer {token}
```

#### Update User

```http
PATCH /users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "NewPassword123!",
  "role": "FREELANCER"
}
```

#### Delete User

```http
DELETE /users/:id
Authorization: Bearer {token}
```

### Services

#### Create Service (Client only)

```http
POST /services
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Website Development",
  "description": "Need a full-stack website",
  "category": "Web Development",
  "budget": 1500.00
}
```

#### Get All Services (Admin only)

```http
GET /services
Authorization: Bearer {token}
```

#### Get My Services (Client)

```http
GET /services/client/my-services
Authorization: Bearer {token}
```

#### Get Service by ID

```http
GET /services/:id
```

#### Update Service

```http
PATCH /services/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "budget": 1400.00
}
```

#### Delete Service

```http
DELETE /services/:id
Authorization: Bearer {token}
```

### Proposals

#### Create Proposal (Freelancer only)

```http
POST /proposals
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": 1,
  "message": "I can complete this in 3 weeks",
  "amount": 1300.00
}
```

#### Get All Proposals (Admin only)

```http
GET /proposals
Authorization: Bearer {token}
```

#### Get My Proposals (Freelancer)

```http
GET /proposals/freelancer/my-proposals
Authorization: Bearer {token}
```

#### Get Proposals by Service

```http
GET /proposals/service/:serviceId
Authorization: Bearer {token}
```

#### Get Proposal by ID

```http
GET /proposals/:id
Authorization: Bearer {token}
```

#### Update Proposal (Freelancer)

```http
PATCH /proposals/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1200.00,
  "message": "Updated proposal"
}
```

#### Accept Proposal (Client only)

```http
PATCH /proposals/:id/accept
Authorization: Bearer {token}
```

#### Reject Proposal (Client only)

```http
PATCH /proposals/:id/reject
Authorization: Bearer {token}
```

#### Delete Proposal (Freelancer)

```http
DELETE /proposals/:id
Authorization: Bearer {token}
```

### Contracts

#### Create Contract (Client only)

```http
POST /contracts
Authorization: Bearer {token}
Content-Type: application/json

{
  "proposalId": 1
}
```

> **Note:** Contracts are also created automatically when a proposal is accepted.

#### Get All Contracts (Admin only)

```http
GET /contracts
Authorization: Bearer {token}
```

#### Get My Contracts as Freelancer

```http
GET /contracts/freelancer/my-contracts
Authorization: Bearer {token}
```

#### Get My Contracts as Client

```http
GET /contracts/client/my-contracts
Authorization: Bearer {token}
```

#### Get Contract by ID

```http
GET /contracts/:id
Authorization: Bearer {token}
```

#### Start Contract (Set to IN_PROGRESS)

```http
PATCH /contracts/:id/in-progress
Authorization: Bearer {token}
```

#### Complete Contract

```http
PATCH /contracts/:id/complete
Authorization: Bearer {token}
```

#### Cancel Contract

```http
PATCH /contracts/:id/cancel
Authorization: Bearer {token}
```

#### Delete Contract (Client only)

```http
DELETE /contracts/:id
Authorization: Bearer {token}
```

## 🔒 User Roles

### CLIENT

- Create and manage services
- View and accept/reject proposals for their services
- Create and manage contracts as client
- View their own contracts

### FREELANCER

- Submit proposals for services
- Manage their own proposals
- View and manage contracts as freelancer
- Update contract status

### ADMIN

- Full access to all resources
- View all users, services, proposals, and contracts
- Can modify any resource

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── strategies/       # Passport strategies (JWT, Local, Refresh)
│   └── dto/             # Login DTOs
├── users/               # User management
│   ├── entities/        # User entity
│   └── dto/            # Create/Update user DTOs
├── services/            # Service management
│   ├── entities/        # Service entity
│   └── dto/            # Service DTOs
├── proposals/           # Proposal management
│   ├── entities/        # Proposal entity
│   └── dto/            # Proposal DTOs
├── contracts/           # Contract management
│   ├── entities/        # Contract entity
│   └── dto/            # Contract DTOs
└── common/              # Shared resources
    ├── guards/          # Auth and role guards
    ├── decorators/      # Custom decorators
    ├── enums/          # Enums (roles, statuses)
    └── interfaces/      # TypeScript interfaces
```

## 🔄 Workflow Example

1. **Client** registers and creates a service request
2. **Freelancers** submit proposals for the service
3. **Client** reviews proposals and accepts one
4. **System** automatically creates a contract
5. **Freelancer** starts work (sets contract to IN_PROGRESS)
6. **Freelancer** completes work (sets contract to COMPLETED)
7. **Client** can confirm or manage the contract

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Refresh token rotation
- ✅ Role-based access control
- ✅ Rate limiting (3 req/sec, 20 req/10sec, 100 req/min)
- ✅ Input validation and sanitization
- ✅ SQL injection protection via TypeORM

## 📝 Available Scripts

```bash
# Development
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start in debug mode

# Production
npm run build           # Build the project
npm run start:prod      # Run production build

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

---

<a name="español"></a>

# 🇪🇸 Español

## 📖 Descripción

**Marketplace Service API** es una API REST completa construida con NestJS para gestionar un marketplace de servicios freelance. Permite a los clientes publicar servicios, a los freelancers enviar propuestas y a ambas partes gestionar contratos a través de su ciclo de vida.

### Características Principales

- 🔐 **Autenticación JWT** - Inicio de sesión seguro y autenticación basada en tokens
- 👥 **Control de Acceso por Roles** - Tres roles: Cliente, Freelancer, Administrador
- 📝 **Gestión de Servicios** - Los clientes pueden crear y gestionar solicitudes de servicios
- 💼 **Sistema de Propuestas** - Los freelancers pueden enviar propuestas para servicios
- 📜 **Flujo de Contratos** - Creación automática de contratos desde propuestas aceptadas
- 🚀 **Caché con Redis** - Optimización de rendimiento para datos frecuentemente accedidos
- 🛡️ **Limitación de Tasa** - Protección contra abuso con throttling
- ✅ **Validación de Entrada** - Validación automática con class-validator

## 🛠️ Stack Tecnológico

- **Framework:** NestJS 11
- **Lenguaje:** TypeScript
- **Base de Datos:** MySQL 8.0
- **ORM:** TypeORM
- **Caché:** Redis
- **Autenticación:** Passport JWT
- **Validación:** class-validator

## 🚀 Comenzando

### Prerequisitos

- Node.js 18+
- MySQL 8.0
- Redis 7+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Boris-Espinosa/Marketplace-Service-Nest.git
cd marketplace-service

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con:
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=marketplace
REDIS_URL=redis://localhost:6379
JWT_PASSWORD=tu_secreto_jwt
REFRESH_JWT_PASSWORD=tu_secreto_refresh
```

### Ejecutar la Aplicación

```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo producción
npm run build
npm run start:prod

# Modo debug
npm run start:debug
```

La API estará disponible en `http://localhost:3000`

## 📚 Documentación de la API

### Autenticación

#### Registrar Usuario

```http
POST /users
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "ClaveSegura123!"
}
```

#### Iniciar Sesión

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "ClaveSegura123!"
}
```

**Respuesta:**

```json
{
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Obtener Usuario Actual

```http
GET /auth/me
Authorization: Bearer {token}
```

#### Refrescar Token

```http
POST /auth/refresh
Authorization: Bearer {refreshToken}
```

### Usuarios

#### Obtener Todos los Usuarios (Solo Admin)

```http
GET /users
Authorization: Bearer {token}
```

#### Obtener Usuario por Email (Solo Admin)

```http
GET /users/:email
Authorization: Bearer {token}
```

#### Actualizar Usuario

```http
PATCH /users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "NuevaContraseña123!",
  "role": "FREELANCER"
}
```

#### Eliminar Usuario

```http
DELETE /users/:id
Authorization: Bearer {token}
```

### Servicios

#### Crear Servicio (Solo Cliente)

```http
POST /services
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Desarrollo de Sitio Web",
  "description": "Necesito un sitio web full-stack",
  "category": "Desarrollo Web",
  "budget": 1500.00
}
```

#### Obtener Todos los Servicios (Solo Admin)

```http
GET /services
Authorization: Bearer {token}
```

#### Obtener Mis Servicios (Cliente)

```http
GET /services/client/my-services
Authorization: Bearer {token}
```

#### Obtener Servicio por ID

```http
GET /services/:id
```

#### Actualizar Servicio

```http
PATCH /services/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "budget": 1400.00
}
```

#### Eliminar Servicio

```http
DELETE /services/:id
Authorization: Bearer {token}
```

### Propuestas

#### Crear Propuesta (Solo Freelancer)

```http
POST /proposals
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": 1,
  "message": "Puedo completar esto en 3 semanas",
  "amount": 1300.00
}
```

#### Obtener Todas las Propuestas (Solo Admin)

```http
GET /proposals
Authorization: Bearer {token}
```

#### Obtener Mis Propuestas (Freelancer)

```http
GET /proposals/freelancer/my-proposals
Authorization: Bearer {token}
```

#### Obtener Propuestas por Servicio

```http
GET /proposals/service/:serviceId
Authorization: Bearer {token}
```

#### Obtener Propuesta por ID

```http
GET /proposals/:id
Authorization: Bearer {token}
```

#### Actualizar Propuesta (Freelancer)

```http
PATCH /proposals/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1200.00,
  "message": "Propuesta actualizada"
}
```

#### Aceptar Propuesta (Solo Cliente)

```http
PATCH /proposals/:id/accept
Authorization: Bearer {token}
```

#### Rechazar Propuesta (Solo Cliente)

```http
PATCH /proposals/:id/reject
Authorization: Bearer {token}
```

#### Eliminar Propuesta (Freelancer)

```http
DELETE /proposals/:id
Authorization: Bearer {token}
```

### Contratos

#### Crear Contrato (Solo Cliente)

```http
POST /contracts
Authorization: Bearer {token}
Content-Type: application/json

{
  "proposalId": 1
}
```

> **Nota:** Los contratos también se crean automáticamente cuando se acepta una propuesta.

#### Obtener Todos los Contratos (Solo Admin)

```http
GET /contracts
Authorization: Bearer {token}
```

#### Obtener Mis Contratos como Freelancer

```http
GET /contracts/freelancer/my-contracts
Authorization: Bearer {token}
```

#### Obtener Mis Contratos como Cliente

```http
GET /contracts/client/my-contracts
Authorization: Bearer {token}
```

#### Obtener Contrato por ID

```http
GET /contracts/:id
Authorization: Bearer {token}
```

#### Iniciar Contrato (Cambiar a EN_PROGRESO)

```http
PATCH /contracts/:id/in-progress
Authorization: Bearer {token}
```

#### Completar Contrato

```http
PATCH /contracts/:id/complete
Authorization: Bearer {token}
```

#### Cancelar Contrato

```http
PATCH /contracts/:id/cancel
Authorization: Bearer {token}
```

#### Eliminar Contrato (Solo Cliente)

```http
DELETE /contracts/:id
Authorization: Bearer {token}
```

## 🔒 Roles de Usuario

### CLIENTE

- Crear y gestionar servicios
- Ver y aceptar/rechazar propuestas para sus servicios
- Crear y gestionar contratos como cliente
- Ver sus propios contratos

### FREELANCER

- Enviar propuestas para servicios
- Gestionar sus propias propuestas
- Ver y gestionar contratos como freelancer
- Actualizar estado de contratos

### ADMINISTRADOR

- Acceso completo a todos los recursos
- Ver todos los usuarios, servicios, propuestas y contratos
- Puede modificar cualquier recurso

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── strategies/       # Estrategias Passport (JWT, Local, Refresh)
│   └── dto/             # DTOs de login
├── users/               # Gestión de usuarios
│   ├── entities/        # Entidad de usuario
│   └── dto/            # DTOs de crear/actualizar usuario
├── services/            # Gestión de servicios
│   ├── entities/        # Entidad de servicio
│   └── dto/            # DTOs de servicio
├── proposals/           # Gestión de propuestas
│   ├── entities/        # Entidad de propuesta
│   └── dto/            # DTOs de propuesta
├── contracts/           # Gestión de contratos
│   ├── entities/        # Entidad de contrato
│   └── dto/            # DTOs de contrato
└── common/              # Recursos compartidos
    ├── guards/          # Guards de auth y roles
    ├── decorators/      # Decoradores personalizados
    ├── enums/          # Enums (roles, estados)
    └── interfaces/      # Interfaces TypeScript
```

## 🔄 Ejemplo de Flujo de Trabajo

1. **Cliente** se registra y crea una solicitud de servicio
2. **Freelancers** envían propuestas para el servicio
3. **Cliente** revisa propuestas y acepta una
4. **Sistema** crea automáticamente un contrato
5. **Freelancer** inicia el trabajo (establece contrato a EN_PROGRESO)
6. **Freelancer** completa el trabajo (establece contrato a COMPLETADO)
7. **Cliente** puede confirmar o gestionar el contrato

## 🛡️ Características de Seguridad

- ✅ Hash de contraseñas con bcrypt
- ✅ Autenticación con token JWT
- ✅ Rotación de refresh tokens
- ✅ Control de acceso basado en roles
- ✅ Limitación de tasa (3 req/seg, 20 req/10seg, 100 req/min)
- ✅ Validación y sanitización de entradas
- ✅ Protección contra inyección SQL vía TypeORM

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Iniciar con hot-reload
npm run start:debug      # Iniciar en modo debug

# Producción
npm run build           # Compilar el proyecto
npm run start:prod      # Ejecutar build de producción

# Calidad de Código
npm run lint            # Ejecutar ESLint
npm run format          # Formatear código con Prettier
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea tu rama de característica (`git checkout -b feature/CaracteristicaIncreible`)
3. Commit tus cambios (`git commit -m 'Agregar CaracteristicaIncreible'`)
4. Push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia UNLICENSED.
