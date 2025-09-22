# POC Projeto Aplicado XPE

A full-stack application demonstrating modern development practices with Docker orchestration, featuring a Node.js/Express backend API and a React Native mobile app with offline-first capabilities.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Backend API   │    │   PostgreSQL    │
│   (React Native)│◄──►│   (Express.js)  │◄──►│   Database      │
│   SQLite        │    │   Umzug Migrations│   │   (Docker)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### Backend
- **Express.js** REST API
- **PostgreSQL** database with automated migrations
- **Umzug** for database schema management
- **Docker** containerization
- **Health check** endpoints

### Mobile App
- **Expo React Native** framework
- **SQLite** for offline-first data storage
- **TypeScript** support
- **Modern UI** components

### Infrastructure
- **Docker Compose** orchestration
- **Automated migrations** on startup
- **Development** and **production** configurations
- **Volume persistence** for database

## 📁 Project Structure

```
poc_pa_xpe/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── migrations/          # Database migrations
│   ├── index.js            # Express server
│   ├── migrate.js          # Migration CLI
│   ├── Dockerfile          # Backend container
│   └── package.json        # Dependencies
├── mobile/                 # React Native app
│   ├── app/                # Expo Router pages
│   ├── components/         # Reusable components
│   ├── database/           # SQLite setup
│   ├── constants/          # App constants
│   └── package.json        # Dependencies
├── docker-compose.yml      # Multi-service orchestration
└── README.md              # This file
```

## 🛠️ Prerequisites

- **Docker** and **Docker Compose**
- **Node.js** 18+ (for local development)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone git@github.com:vitor-manoel/poc-projeto-aplicado-xpe.git
cd poc-projeto-aplicado-xpe
```

### 2. Start the Application Stack
```bash
docker-compose up
```

This will start:
- PostgreSQL database (port 5432)
- Database migrations (runs automatically)
- Backend API (port 3000)
- Mobile development server (port 8081)

### 3. Access the Services

- **Backend API**: http://localhost:3000
- **Mobile Dev Server**: http://localhost:8081
- **PostgreSQL**: localhost:5432

## 📱 Mobile App Development

### Install Dependencies
```bash
cd mobile
npm install
```

### Start Development Server
```bash
npm start
# or
npx expo start
```

### Run on Device
- Install **Expo Go** app on your mobile device
- Scan the QR code from the terminal
- The app will load with live reloading

## 🔧 Backend Development

### Install Dependencies
```bash
cd backend
npm install
```

### Run Locally
```bash
npm start
```

### Database Migrations
```bash
# Run migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback migrations
npm run migrate:down
```

## 📊 API Endpoints

### Health & Status
- `GET /` - Welcome message
- `GET /api/health` - Health check with uptime

### Sample Data
- `GET /api/users` - List of sample users

### Example Response
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐳 Docker Services

### Services Overview
- **postgres**: PostgreSQL 15 Alpine database
- **migrations**: Runs database migrations on startup
- **backend**: Express.js API server
- **mobile**: Expo development server

### Environment Variables
```yaml
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=poc_pa_xpe
DB_USER=admin
DB_PASSWORD=password123
DATABASE_URL=postgresql://admin:password123@postgres:5432/poc_pa_xpe
```

## 🔄 Development Workflow

### 1. Database Changes
1. Create new migration file in `backend/migrations/`
2. Run `docker-compose up` to apply changes
3. Migrations run automatically on startup

### 2. Backend Changes
1. Modify code in `backend/`
2. Changes are reflected immediately (volume mount)
3. Restart container if needed: `docker-compose restart backend`

### 3. Mobile Changes
1. Modify code in `mobile/`
2. Expo automatically reloads the app
3. Changes appear instantly on connected devices

## 🧪 Testing

### Backend API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Get users
curl http://localhost:3000/api/users
```

### Database Connection
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U admin -d poc_pa_xpe
```

## 📦 Dependencies

### Backend
- **express**: Web framework
- **pg**: PostgreSQL client
- **umzug**: Database migrations

### Mobile
- **expo**: React Native framework
- **expo-sqlite**: SQLite adapter

## 🚀 Production Deployment

### Environment Setup
1. Update environment variables in `docker-compose.yml`
2. Use production database credentials
3. Configure proper networking and security

### Build for Production
```bash
# Build mobile app
cd mobile
npx expo build:android
npx expo build:ios

# Backend is already containerized
docker-compose -f docker-compose.prod.yml up
```