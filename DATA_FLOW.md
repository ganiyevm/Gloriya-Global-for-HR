# Frontend to Database Data Flow

## Overview
The application now has full integration between the frontend and backend, with data flowing from the React frontend to the PostgreSQL database via Express API.

## Data Flow Architecture

### 1. **User Authentication**
```
Frontend Login Form
    ↓
AuthContext.login() → POST /api/auth/login
    ↓
Backend Auth Route (validates against DB)
    ↓
Returns JWT Token + User Info
    ↓
Frontend stores token in localStorage
    ↓
Token included in all subsequent API requests
```

### 2. **File Import Process**
```
Frontend FileImport Component
    ↓
User selects Excel file
    ↓
parseExcelFile() - Parses Excel in browser
    ↓
processImportedEmployee() - Transforms data
    ↓
Creates AttendanceRecord objects locally
    ↓
attendanceAPI.bulkImport() → POST /api/attendance/bulk-import
    ↓
Backend validates & stores in Neon PostgreSQL
    ↓
Returns success response with counts
    ↓
Frontend updates UI with results
```

## API Service Layer

Location: `src/services/api.ts`

### Available APIs:

**Authentication:**
- `authAPI.login(username, password)` - POST /api/auth/login
- `authAPI.getCurrentUser(token)` - GET /api/auth/me

**Employees:**
- `employeeAPI.getAll(token)` - GET /api/employees
- `employeeAPI.getById(id, token)` - GET /api/employees/:id
- `employeeAPI.create(data, token)` - POST /api/employees
- `employeeAPI.update(id, data, token)` - PUT /api/employees/:id
- `employeeAPI.delete(id, token)` - DELETE /api/employees/:id

**Attendance:**
- `attendanceAPI.getAll(token, filters)` - GET /api/attendance
- `attendanceAPI.create(data, token)` - POST /api/attendance
- `attendanceAPI.bulkImport(records, token)` - POST /api/attendance/bulk-import

## Data Format

### Attendance Record (sent to backend):
```json
{
  "employeeId": 1,
  "date": "2025-01-15",
  "statusCode": "W",
  "status": "present",
  "isViolation": false,
  "isWorkDay": true
}
```

### API Response Example:
```json
{
  "message": "Bulk import completed",
  "successCount": 150,
  "totalCount": 150,
  "errors": null
}
```

## Database Storage

All data is persisted in Neon PostgreSQL with these tables:

1. **users** - User credentials and roles
2. **employees** - Employee information
3. **attendance** - Daily attendance records
4. **import_history** - Import operation logs

## Key Features

✅ **JWT Authentication** - Secure token-based auth with 30-minute expiry
✅ **Role-based Access** - Admin/Manager/Accountant roles
✅ **Bulk Import** - Efficiently insert thousands of attendance records
✅ **Error Handling** - Graceful error handling with user feedback
✅ **Auto-logout** - Token expiry triggers automatic logout
✅ **Progress Tracking** - Real-time import progress updates

## Testing the Integration

1. **Start Backend:** `cd backend && npm run dev`
2. **Start Frontend:** `cd hr-analytics && npm run dev`
3. **Login:** Use admin/password123
4. **Import Data:** Go to Admin Panel → Import Excel file
5. **Verify:** Check database via Prisma Studio or query directly

## Next Steps

1. Add employee creation/update forms
2. Implement employee detail editing
3. Add attendance record filtering and export
4. Create analytics dashboard with real data
5. Add data validation and error handling
