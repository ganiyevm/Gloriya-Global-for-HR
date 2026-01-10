# Gloriya HR Analytics Backend

Node.js Express API with PostgreSQL database for HR Analytics application.

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gloriya_hr
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

## Database Setup

1. Create PostgreSQL database:
```bash
createdb gloriya_hr
```

2. Run seeds (creates tables and adds demo data):
```bash
npm run db:seed
```

## Running

Development mode:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `POST /api/attendance/bulk-import` - Bulk import attendance

### Health
- `GET /api/health` - Server health check

## Demo Users

After seeding:
- **Admin**: admin / password123
- **Manager**: manager / password123
- **Accountant**: accountant / password123

## Project Structure

```
backend/
├── src/
│   ├── server.ts
│   ├── database/
│   │   ├── init.ts
│   │   └── seed.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── employee.routes.ts
│   │   └── attendance.routes.ts
│   └── middleware/
│       └── auth.ts
├── package.json
├── tsconfig.json
└── .env.example
```
