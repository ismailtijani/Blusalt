# 🚁 Drone Logistics Management System

A backend service built with **NestJS** for managing a fleet of drones delivering medical supplies. The system provides comprehensive drone fleet management, real-time monitoring, automated battery health checks, secure role-based access control, event-driven audit logging, and intelligent delivery assignment—all designed with modular architecture for enterprise scalability.

---

## ✨ Key Features

- **Drone Fleet Management** – Register drones (4 weight classes), monitor states (6 states: IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING), track weight capacity (max 500g) & battery levels
- **Smart Drone Assignment** – Intelligent algorithm finds nearest available drone based on location, battery (>25%), and capacity
- **Automated Battery Monitoring** – Periodic checks every 10 minutes with low battery alerts and audit logging
- **Medication Catalog** – Manage medications with validated naming (letters, numbers, '-', '\_'), uppercase codes, image storage, and type classification (MEDICATION, MEDICAL_SUPPLIES, OTHER)
- **Delivery Management** – Create requests with priority levels (LOW, MEDIUM, HIGH, URGENT), auto-assign drones, track status (7 states), and monitor delivery progress
- **Real-Time Monitoring** – Live drone location tracking (GPS coordinates), battery alerts, load weight monitoring, and state transitions
- **Security & Authentication** – JWT-based auth with refresh tokens, role-based access control (Admin, Staff, Client), password hashing with bcrypt
- **Event-Driven Audit System** – Comprehensive activity logging with user actions, system events, battery checks, and API request tracking
- **Role-Based Access** – Admin (full access), Staff (operations), Client (order management) with fine-grained permissions

---

## 🏗️ Architecture & Tech Stack

- **Framework**: NestJS (TypeScript) with modular monolith architecture
- **Database**: PostgreSQL with TypeORM (migrations, seeding, relations)
- **Caching & Real-Time**: Redis for session management and caching
- **Authentication**: JWT + Passport.js with refresh token rotation
- **Validation**: class-validator & class-transformer with custom DTOs
- **Event System**: @nestjs/event-emitter for decoupled audit logging
- **Scheduling**: @nestjs/schedule for periodic battery checks (cron)
- **Documentation**: Swagger/OpenAPI with interactive API explorer
- **Containerization**: Docker & Docker Compose for development and production

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+ (optional, for caching)
- Docker & Docker Compose (optional)

### Manual Setup

1. **Clone and install dependencies**

   ```bash
   git clone  https://github.com/ismailtijani/Blusalt.git
   cd Blusalt
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   **Key environment variables:**

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=drone_logistics

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=15m
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_REFRESH_EXPIRATION=7d

   # Application
   PORT=8080
   NODE_ENV=development
   ```

3. **Prepare database**

   ```bash
   # Create database
   createdb drone_logistics

   # Run migrations
   npm run migration:run

   # Seed initial data (10 drones, medications, users)
   npm run seed
   ```

4. **Start the application**

   ```bash
   # Development with hot reload
   npm run start:dev

   # Production build
   npm run build
   npm run start:prod
   ```

### Docker Setup ()

```bash
# Development environment (app + PostgreSQL + Redis + PgAdmin)
npm run docker:dev

# Production environment
npm run docker:prod

# Stop containers
npm run docker:down
```

**Access Points:**

- **API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api
- **PgAdmin**: http://localhost:8080 (admin@admin.com / admin)

---

## 📖 API Documentation

### Authentication Endpoints

```
POST   /api/blusalt/v1/auth/          Register new user
POST   /api/blusalt/v1/auth/login             Login (returns access + refresh tokens)
POST   /api/blusalt/v1/auth/refresh           Refresh access token
POST   /api/blusalt/v1/auth/logout            Logout (invalidate tokens)
POST   /api/blusalt/v1/auth/forgot-password   Request password reset
POST   /api/blusalt/v1/auth/reset-password    Reset password with token
```

### Drone Management

```
POST   /api/blusalt/v1/drones                        Register new drone (Admin only)
GET    /api/blusalt/v1/drones                        List all drones (paginated)
GET    /api/blusalt/v1/drones/available              Get available drones for loading
GET    /api/blusalt/v1/drones/:droneId               Get drone details
PATCH  /api/blusalt/v1/drones/:droneId               Update drone configuration
DELETE /api/blusalt/v1/drones/:droneId               Delete drone (soft delete)
POST   /api/blusalt/v1/drones/:droneId/load          Load drone with medications
GET    /api/blusalt/v1/drones/:droneId/medications   Get loaded medications
GET    /api/blusalt/v1/drones/:droneId/battery       Check battery level
PATCH  /api/blusalt/v1/drones/:droneId/location      Update drone GPS location
```

### Medication Catalog

```
POST   /api/blusalt/v1/medications                   Create medication (Admin only)
GET    /api/blusalt/v1/medications                   List medications (paginated)
GET    /api/blusalt/v1/medications/active            Get active medications only
GET    /api/blusalt/v1/medications/search?term=...   Search by name or code
GET    /api/blusalt/v1/medications/:medicationId     Get medication details
PATCH  /api/blusalt/v1/medications/:medicationId     Update medication
DELETE /api/blusalt/v1/medications/:medicationId     Delete medication (soft delete)
```

### Delivery Management

```
POST   /api/blusalt/v1/deliveries                    Create delivery request
GET    /api/blusalt/v1/deliveries                    List deliveries (filtered, paginated)
GET    /api/blusalt/v1/deliveries/:deliveryId        Get delivery details
PATCH  /api/blusalt/v1/deliveries/:deliveryId        Update delivery status
POST   /api/blusalt/v1/deliveries/:deliveryId/assign Auto-assign drone to delivery
DELETE /api/blusalt/v1/deliveries/:deliveryId        Cancel delivery
```

### User Management (Admin Only)

```
POST   /api/blusalt/v1/users                 Create user
GET    /api/blusalt/v1/users                 List users (paginated)
GET    /api/blusalt/v1/users/:userId         Get user details
PATCH  /api/blusalt/v1/users/:userId         Update user
DELETE /api/blusalt/v1/users/:userId         Delete user (soft delete)
```

### Audit Logs (Admin/Staff Only)

```
GET    /api/blusalt/v1/audit-logs                         Get activity logs (filtered)
GET    /api/blusalt/v1/audit-logs/:auditLogId             Get specific log entry
GET    /api/blusalt/v1/audit-logs/user/:userId            Get user activity history
GET    /api/blusalt/v1/audit-logs/client/:clientId        Get client activity history
```

**Interactive documentation available at:** `/api/`

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e

# Watch mode (development)
npm run test:watch
```

**Coverage goals:**

- Unit tests: >80%
- E2E tests: Critical user flows
- Integration tests: API endpoints

---

## 📊 Database Schema

### Core Entities

**Users**

- Multi-role support (Admin, Staff, Client)
- Client types: Hospital, Pharmacy, Medical Center, Individual
- Organization name and verification status
- Secure password storage with bcrypt

**Drones**

- Serial number (unique, max 100 chars)
- Model types: Lightweight (200g), Middleweight (300g), Cruiserweight (400g), Heavyweight (500g)
- Battery capacity (percentage)
- State machine: IDLE → LOADING → LOADED → DELIVERING → DELIVERED → RETURNING
- GPS tracking (current + base location)
- Maintenance tracking (last maintenance date, total flight time)

**Medications**

- Validated name (letters, numbers, '-', '\_')
- Uppercase code (letters, numbers, '\_')
- Weight specification
- Type classification (MEDICATION, MEDICAL_SUPPLIES, OTHER)
- Image URL storage

**Delivery Requests**

- Pickup and destination (GPS + address)
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Status tracking (PENDING, APPROVED, ASSIGNED, IN_PROGRESS, DELIVERED, CANCELLED)
- Auto drone assignment based on proximity and availability
- Estimated vs actual delivery time tracking

**Audit Logs**

- Unified activity tracking for all user types
- Action data and feedback (JSONB)
- IP address, user agent, timestamp
- Support for masked sensitive data

### Relationships

- User → Audit Logs (one-to-many)
- Drone → Deliveries (one-to-many)
- Drone → DroneMedications (one-to-many)
- Medication → DroneMedications (one-to-many)
- Delivery → User (many-to-one, requester)

---

## 🔐 Security Features

**Authentication & Authorization**

- JWT-based stateless authentication
- Refresh token rotation with Redis storage
- Role-based access control (RBAC) with guards
- Permission-based fine-grained access
- Session management and concurrent login handling

**Data Protection**

- Password hashing with bcrypt (10 rounds)
- Input validation and sanitization on all endpoints
- SQL injection prevention via parameterized queries (TypeORM)
- XSS protection with class-transformer
- CORS configuration for allowed origins
- Rate limiting on sensitive endpoints

**Audit & Compliance**

- Comprehensive activity logging (all CRUD operations)
- IP address and user agent tracking
- Automatic sensitive data redaction (passwords, tokens)
- Event-driven logging (non-blocking)
- Automated battery check audit trail

---

## 👥 Default Users (After Seeding)

| Role   | Email                         | Password     | Permissions                     |
| ------ | ----------------------------- | ------------ | ------------------------------- |
| Admin  | admin@dronelogistics.com      | Admin123!@#  | Full system access, user mgmt   |
| Staff  | operations@dronelogistics.com | Staff123!@#  | Operations, drone monitoring    |
| Client | orders@generalhospital.com    | Client123!@# | Create orders, track deliveries |

**First-time setup:** Change all default passwords immediately after deployment.

---

## 🔧 Configuration

### Environment Variables Reference

```env
# Application
PORT=8080
NODE_ENV=development|production
API_PREFIX=api/blusalt/v1

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_DATABASE=drone_logistics
DATABASE_SSL=false

# JWT
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# SECURITY
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_DEST=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png

# API Rate Limiting
RATE_LIMIT_TTL=60  # seconds
RATE_LIMIT_MAX=100  # requests
```

---

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication & authorization
│   ├── users/          # User management
│   ├── drones/         # Drone fleet management
│   ├── medications/    # Medication catalog
│   ├── deliveries/     # Delivery requests & tracking
│   ├── audit-log/      # Activity logging & battery checks
│   └── config/         # Configuration module
├── shared/
│   ├── entities/       # Base entity & shared entities
│   ├── dto/            # Shared DTOs
│   ├── guards/         # Auth, Role, Permission guards
│   ├── interceptors/   # Serialization, logging
│   ├── decorators/     # Custom decorators (@GetUser, etc.)
│   ├── enums/          # Shared enums
│   └── constants/      # Routes, messages, limits
├── database/
│   ├── migrations/     # TypeORM migrations
│   └── seeds/          # Database seeding scripts
├── config/             # Configuration files
└── main.ts             # Application entry point
```

---


