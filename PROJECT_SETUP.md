# Gloriya HR Analytics - Project Setup Guide

## Project Structure

```
Employee-Churn-Prediction/
├── backend/                    # Node.js/Express API with PostgreSQL
│   ├── src/
│   │   ├── server.ts
│   │   ├── database/
│   │   │   ├── init.ts        # Database connection & table creation
│   │   │   └── seed.ts        # Demo data seeding
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── employee.routes.ts
│   │   │   └── attendance.routes.ts
│   │   └── middleware/
│   │       └── auth.ts        # JWT verification
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
└── hr-analytics/              # React/TypeScript Frontend
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   └── ...
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create PostgreSQL database:
```bash
createdb gloriya_hr
```

4. Setup environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database credentials.

5. Seed database:
```bash
npm run db:seed
```

6. Start backend server:
```bash
npm run dev
```

Backend will run on: **http://localhost:5000**

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd hr-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Update API base URL in frontend:
   - In `src/App.tsx` or create `.env`:
   - `VITE_API_URL=http://localhost:5000`

4. Start frontend:
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

## Default Credentials

After running `npm run db:seed`:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Manager | manager | password123 |
| Accountant | accountant | password123 |

## Role-Based Access

### Admin Users
- ✅ Dashboard
- ✅ Charts
- ✅ Employees
- ✅ Import Data
- ✅ Settings (Database Management)

### Manager/Accountant Users
- ✅ Dashboard
- ✅ Charts
- ✅ Employees
- ❌ Import Data
- ❌ Settings

## Technology Stack

### Backend
- Node.js 18+
- Express.js 4.x
- PostgreSQL 12+
- TypeScript 5
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components
- Zustand (state management)
- Lucide icons

## Key Features

✅ JWT-based authentication
✅ Role-based access control (RBAC)
✅ Employee management
✅ Attendance tracking
✅ Data import/export
✅ Admin dashboard
✅ Multi-language support (Uzbek, Russian, English)
✅ Dark/Light theme
✅ Responsive design
✅ Database persistence

## Database Schema

### Users Table
```sql
- id (PK)
- username (UNIQUE)
- password (hashed)
- name
- role (admin/manager/accountant)
- created_at
```

### Employees Table
```sql
- id (PK)
- name
- email
- department
- position
- created_at
```

### Attendance Table
```sql
- id (PK)
- employee_id (FK)
- date
- status_code (W/L/E/LE/A/NS/H)
- created_at
```

### Import History Table
```sql
- id (PK)
- file_name
- import_date
- records_count
- new_employees
- updated_records
- created_at
```

## Next Steps

1. ✅ Backend API created with PostgreSQL
2. ✅ Authentication & authorization implemented
3. ✅ Employee & Attendance CRUD operations ready
4. 🔄 Connect frontend to backend API
5. 🔄 Implement data import functionality
6. 🔄 Add more admin features

## Connecting Frontend to Backend

Update your frontend API calls to use the backend endpoints:

```typescript
// Example in React component
const response = await fetch('http://localhost:5000/api/employees', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Support

For issues or questions:
1. Check backend README at `backend/README.md`
2. Check frontend console for errors
3. Verify PostgreSQL is running
4. Check `.env` configuration
