# Quick Start Guide - Data Integration Complete ✅

## What's Ready

Your HR Analytics application now has full frontend-to-database integration:

- ✅ **Backend Server** running on `http://localhost:5001`
- ✅ **Frontend Server** running on `http://localhost:5173`
- ✅ **Neon PostgreSQL** database with seeded demo data
- ✅ **API Layer** for secure data communication
- ✅ **Authentication System** with JWT tokens
- ✅ **File Import** with automatic database storage

## Starting the Application

### Terminal 1 - Backend Server
```bash
cd "/Users/hiramoo/Desktop/Gloriya project/Employee-Churn-Prediction/backend"
npm run dev
# Server runs on http://localhost:5001
```

### Terminal 2 - Frontend Server
```bash
cd "/Users/hiramoo/Desktop/Gloriya project/Employee-Churn-Prediction/hr-analytics"
npm run dev
# App runs on http://localhost:5173
```

## Demo Credentials

Login to the application with any of these:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password123` |
| Manager | `manager` | `password123` |
| Accountant | `accountant` | `password123` |

## Data Flow Example

### 1. User Logs In
```javascript
// Frontend sends credentials
POST http://localhost:5001/api/auth/login
{
  "username": "admin",
  "password": "password123"
}

// Backend validates in database
// Returns JWT token + user info
```

### 2. Admin Imports Excel File
```javascript
// Frontend reads Excel (client-side)
// Sends attendance records to backend
POST http://localhost:5001/api/attendance/bulk-import
Authorization: Bearer {JWT_TOKEN}
{
  "records": [
    {
      "employeeId": 1,
      "date": "2025-01-15",
      "statusCode": "W"
    },
    // ... more records
  ]
}

// Backend stores in Neon PostgreSQL
// Returns success response
```

## Database Verification

### Check data in database:
```bash
# Using psql directly
psql postgresql://neondb_owner:npg_7xJrnVlY0Shq@ep-divine-truth-aho3oqwz-pooler.c-3.us-east-1.aws.neon.tech/neondb

# Check users
SELECT * FROM users;

# Check employees
SELECT * FROM employees;

# Check attendance
SELECT * FROM attendance LIMIT 10;
```

## File Structure

```
Backend (Node.js/Express):
- src/routes/attendance.routes.ts    → Handles attendance data
- src/routes/employee.routes.ts      → Handles employee data
- src/routes/auth.routes.ts          → Handles authentication
- src/middleware/auth.ts             → JWT verification

Frontend (React/TypeScript):
- src/components/FileImport.tsx      → Imports Excel files
- src/services/api.ts                → API service layer
- src/contexts/AuthContext.tsx       → Auth state management
```

## Import Excel File

1. Login as admin
2. Go to "Admin Panel" tab
3. Click "Import Excel"
4. Upload attendance Excel file
5. Preview data
6. Click "Import"
7. Data is automatically saved to database

## Supported Attendance Status Codes

- `W` - Well (Present on time)
- `L` - Late
- `E` - Early leave
- `LE` - Late and Early leave
- `A` - Absent
- `NS` - No Schedule (Weekend/Non-working day)
- `H` - Holiday

## Troubleshooting

### Backend won't start
```bash
# Kill any existing process on port 5001
kill -9 $(lsof -t -i:5001)

# Try again
npm run dev
```

### Frontend won't start
```bash
# Kill any existing process on port 5173
kill -9 $(lsof -t -i:5173)

# Try again
npm run dev
```

### Database connection error
Check `.env` file has:
```
DATABASE_URL=postgresql://neondb_owner:npg_7xJrnVlY0Shq@ep-divine-truth-aho3oqwz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=gloriya_hr_secret_key_change_in_production
```

## Features Implemented

✅ JWT Authentication
✅ Role-based Access Control
✅ Excel File Import
✅ Bulk Attendance Record Storage
✅ Employee Management
✅ Token Auto-expiry
✅ Error Handling & Validation
✅ Progress Tracking
✅ Cloud Database (Neon PostgreSQL)

## Next Development Steps

1. **Employee Forms** - Add create/edit employee forms
2. **Data Analytics** - Build charts and reports
3. **Attendance Filtering** - Filter by date range, employee
4. **Export Reports** - Export attendance data to Excel
5. **Advanced Search** - Search by employee name, department
6. **User Management** - Add/edit users (admin only)
7. **Audit Logs** - Track all data changes

---

**Status:** ✅ Ready for Development
**Database:** ✅ Connected to Neon PostgreSQL
**API:** ✅ All endpoints working
**Frontend:** ✅ Synced with backend
