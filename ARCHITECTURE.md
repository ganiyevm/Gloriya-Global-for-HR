# System Architecture Diagram

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│              EMPLOYEE CHURN PREDICTION SYSTEM                    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FRONTEND LAYER (React 18 + TypeScript + Vite)          │   │
│  │  http://localhost:5173                                   │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Components & Pages                             │    │   │
│  │  │  ├── LoginPage → AuthContext                    │    │   │
│  │  │  ├── Dashboard → useStore + API calls           │    │   │
│  │  │  ├── FileImport → Excel parsing + API calls     │    │   │
│  │  │  ├── AdminPanel → Role-based features           │    │   │
│  │  │  └── EmployeeList → Real-time data display      │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  State Management                               │    │   │
│  │  │  ├── AuthContext → User auth state              │    │   │
│  │  │  ├── useStore (Zustand) → Local data            │    │   │
│  │  │  └── localStorage → Token persistence           │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Services                                        │    │   │
│  │  │  ├── api.ts → authAPI, employeeAPI,             │    │   │
│  │  │  │            attendanceAPI                      │    │   │
│  │  │  ├── excelParser.ts → Parse Excel files         │    │   │
│  │  │  └── attendanceCalculator.ts → Transform data   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                 ▲                                 │
│                                 │                                 │
│                    HTTP + JWT Token (Bearer)                     │
│                                 │                                 │
│                                 ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  BACKEND LAYER (Express.js + Node.js)                   │   │
│  │  http://localhost:5001                                   │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Routes & Controllers                           │    │   │
│  │  │  ├── POST /auth/login → Validate user           │    │   │
│  │  │  ├── GET /auth/me → Current user                │    │   │
│  │  │  ├── CRUD /employees → Employee management      │    │   │
│  │  │  ├── POST /attendance/bulk-import → Insert data │    │   │
│  │  │  └── GET /health → Server status                │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Middleware & Security                          │    │   │
│  │  │  ├── auth.ts → JWT verification                 │    │   │
│  │  │  ├── CORS → Cross-origin requests               │    │   │
│  │  │  ├── Error handler → Consistent responses       │    │   │
│  │  │  └── Validation → Input sanitization            │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Database Layer                                 │    │   │
│  │  │  └── PostgreSQL Pool (init.ts) → Query builder  │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                 ▲                                 │
│                                 │                                 │
│                           SQL Queries                             │
│                                 │                                 │
│                                 ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  DATABASE LAYER (Neon PostgreSQL - Cloud)               │   │
│  │  postgresql://...@...-pooler.c-3.us-east-1...           │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  USERS TABLE                                    │    │   │
│  │  │  ├── id (SERIAL PRIMARY KEY)                    │    │   │
│  │  │  ├── username (VARCHAR UNIQUE)                  │    │   │
│  │  │  ├── password (VARCHAR hashed)                  │    │   │
│  │  │  ├── name (VARCHAR)                             │    │   │
│  │  │  ├── role (admin/manager/accountant)            │    │   │
│  │  │  └── created_at (TIMESTAMP)                     │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  EMPLOYEES TABLE                                │    │   │
│  │  │  ├── id (SERIAL PRIMARY KEY)                    │    │   │
│  │  │  ├── name (VARCHAR)                             │    │   │
│  │  │  ├── email (VARCHAR)                            │    │   │
│  │  │  ├── department (VARCHAR)                       │    │   │
│  │  │  ├── position (VARCHAR)                         │    │   │
│  │  │  └── created_at (TIMESTAMP)                     │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  ATTENDANCE TABLE                               │    │   │
│  │  │  ├── id (SERIAL PRIMARY KEY)                    │    │   │
│  │  │  ├── employee_id (FK → employees)               │    │   │
│  │  │  ├── date (DATE)                                │    │   │
│  │  │  ├── status_code (W/L/E/LE/A/NS/H)              │    │   │
│  │  │  ├── created_at (TIMESTAMP)                     │    │   │
│  │  │  └── UNIQUE(employee_id, date)                 │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  IMPORT_HISTORY TABLE                           │    │   │
│  │  │  ├── id (SERIAL PRIMARY KEY)                    │    │   │
│  │  │  ├── file_name (VARCHAR)                        │    │   │
│  │  │  ├── import_date (TIMESTAMP)                    │    │   │
│  │  │  ├── records_count (INTEGER)                    │    │   │
│  │  │  └── created_by (FK → users)                    │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Authentication

```
┌──────────────┐
│ User clicks  │
│   "Login"    │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────┐
│ Enter credentials:              │
│ Username: admin                 │
│ Password: password123           │
└──────┬────────────────────────┬─┘
       │                        │
       ▼                        ▼
   [Cancel]             [Submit/Login]
       │                        │
       │                        ▼
       │                ┌─────────────────────┐
       │                │ AuthContext.login() │
       │                └──────┬──────────────┘
       │                       │
       │                       ▼
       │              ┌──────────────────────┐
       │              │ POST /api/auth/login │
       │              └──────┬───────────────┘
       │                     │
       │                     ▼
       │            ┌──────────────────────┐
       │            │ Backend: Validate    │
       │            │ - Check username     │
       │            │ - Check password     │
       │            │ - Query database     │
       │            └──────┬───────────────┘
       │                   │
       ├─ Failed ─────────>│ Send error response
       │                   │ {error: "Invalid credentials"}
       │                   │
       │                   ▼
       │         ┌─────────────────────┐
       │         │ Frontend: Show error │
       │         │ "Invalid credentials"│
       │         └─────────────────────┘
       │
       └─ Success ────────>│ Generate JWT token
                           │ {token: "eyJ...", user: {...}}
                           │
                           ▼
                  ┌──────────────────────┐
                  │ Frontend: Store token│
                  │ - localStorage       │
                  │ - setUser(userData)  │
                  │ - Redirect to home   │
                  └──────────────────────┘
```

## Data Flow: Excel Import

```
┌──────────────────────────┐
│ Admin selects Excel file │
└──────┬───────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ parseExcelFile() [Client-side]     │
│ - Read Excel structure             │
│ - Extract headers & dates          │
│ - Extract employee data            │
│ - Map attendance records           │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ processImportedEmployee()           │
│ - Transform status codes           │
│ - Create AttendanceRecord objects  │
│ - Calculate statistics             │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Show preview to user               │
│ - First 5 rows of data             │
│ - Record count                     │
│ - Any warnings                     │
└──────┬─────────────────────────────┘
       │
       ├─ Cancel ─> Clear and exit
       │
       └─ Confirm ─> Click "Import"
                     │
                     ▼
            ┌────────────────────────┐
            │ POST /api/attendance/  │
            │ bulk-import            │
            │ + JWT token            │
            │ {records: [...]        │
            │  count: 1000}          │
            └──────┬─────────────────┘
                   │
                   ▼
            ┌────────────────────────┐
            │ Backend: Process bulk  │
            │ FOR EACH record:       │
            │ - Validate data        │
            │ - Create employee      │
            │   if not exists        │
            │ - INSERT/UPDATE        │
            │   attendance           │
            │ - Handle conflicts     │
            └──────┬─────────────────┘
                   │
       ┌─ Error ─>│ Return error details
       │          │ {error: "...", count: 500}
       │          │
       │          ▼
       │  ┌──────────────────┐
       │  │ Frontend: Show   │
       │  │ error message    │
       │  │ Allow retry      │
       │  └──────────────────┘
       │
       └─ Success ──> Return success
                      {successCount: 1000,
                       totalCount: 1000}
                      │
                      ▼
                ┌──────────────────┐
                │ Frontend: Update │
                │ - Progress to 100%
                │ - Show success   │
                │ - Update store   │
                │ - Close dialog   │
                └──────────────────┘
                      │
                      ▼
           Database now contains
           all attendance records!
```

## API Request/Response Cycle

```
┌─────────────────────────────────────┐
│ Frontend Component                  │
│ (FileImport.tsx)                    │
└──────────────┬──────────────────────┘
               │
               │ Calls API Service
               │ attendanceAPI.bulkImport(records, token)
               │
               ▼
┌─────────────────────────────────────┐
│ API Service (services/api.ts)       │
│                                     │
│ 1. Add headers:                     │
│    - Content-Type: application/json │
│    - Authorization: Bearer {token}  │
│                                     │
│ 2. Prepare body:                    │
│    {records: [...]}                 │
│                                     │
│ 3. Make POST request                │
└──────────────┬──────────────────────┘
               │
               │ HTTP POST
               │ http://localhost:5001/api/attendance/bulk-import
               │
               ▼
┌─────────────────────────────────────┐
│ Express Backend Server              │
│                                     │
│ 1. Receive request                  │
│ 2. Check auth middleware:           │
│    - Extract token from header      │
│    - Verify JWT signature           │
│    - Get user info (userId, role)   │
│                                     │
│ 3. Route to handler:                │
│    router.post('/bulk-import', ...) │
│                                     │
│ 4. Validate input:                  │
│    - Check records is array         │
│    - Check required fields          │
│                                     │
│ 5. Process records:                 │
│    FOR EACH record:                 │
│      - Check employee exists        │
│      - Create if needed             │
│      - INSERT/UPDATE attendance     │
│                                     │
│ 6. Build response:                  │
│    {                                │
│      message: "...",                │
│      successCount: 1000,            │
│      totalCount: 1000,              │
│      errors: []                     │
│    }                                │
│                                     │
│ 7. Send response                    │
└──────────────┬──────────────────────┘
               │
               │ HTTP Response (JSON)
               │ Status: 201 Created
               │
               ▼
┌─────────────────────────────────────┐
│ API Service (services/api.ts)       │
│                                     │
│ 1. Check response.ok (status < 300) │
│ 2. Parse JSON response              │
│ 3. Return to component              │
└──────────────┬──────────────────────┘
               │
               │ Promise resolves
               │ with response data
               │
               ▼
┌─────────────────────────────────────┐
│ Frontend Component                  │
│ (FileImport.tsx)                    │
│                                     │
│ 1. Receive response                 │
│ 2. Handle success:                  │
│    - setImportStatus('success')     │
│    - Update progress bar to 100%    │
│    - Show success message           │
│    - Update UI                      │
│                                     │
│ Or handle error:                    │
│    - setImportStatus('error')       │
│    - Show error message             │
│    - Let user retry                 │
└─────────────────────────────────────┘
```

## Database Query Execution

```
Backend receives:
  POST /api/attendance/bulk-import
  {records: [{employeeId: 1, date: "2025-01-15", statusCode: "W"}, ...]}

For each record:
  │
  ├─> Check if employee exists:
  │   SELECT id FROM employees WHERE id = $1
  │   │
  │   ├─ Not found: CREATE new employee
  │   │  INSERT INTO employees (id, name, ...) VALUES (...)
  │   │
  │   └─ Found: Continue
  │
  └─> Insert/Update attendance:
      INSERT INTO attendance (employee_id, date, status_code)
      VALUES ($1, $2, $3)
      ON CONFLICT (employee_id, date)
      DO UPDATE SET status_code = $3

Result: All attendance records stored in PostgreSQL
```

## Security Flow

```
User Request
    │
    ▼
┌────────────────────────┐
│ CORS Middleware        │
│ Check origin allowed   │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Auth Middleware        │
│ Extract Authorization  │
│ header                 │
└──────┬─────────────────┘
       │
       ├─ No token ──────> 401 Unauthorized
       │
       └─ Has token ────> Verify JWT
                          │
                          ├─ Invalid ────> 401 Unauthorized
                          │
                          ├─ Expired ────> 401 Token expired
                          │
                          └─ Valid ─────> Extract payload
                                         Set req.userId
                                         Set req.role
                                         │
                                         ▼
                                    Continue to route
```

## Component Hierarchy

```
App.tsx
├── AuthProvider
│   ├── LoginPage
│   │   └── useAuth()
│   │       ├── login()
│   │       └── logout()
│   │
│   └── Dashboard (Protected)
│       ├── FileImport
│       │   └── attendanceAPI.bulkImport()
│       │
│       ├── AdminPanel (role === 'admin')
│       │   └── Admin-only features
│       │
│       ├── Charts
│       │   └── useStore() + API calls
│       │
│       └── EmployeeList
│           └── employeeAPI.getAll()
```

---

This comprehensive architecture ensures:
- ✅ Secure authentication with JWT
- ✅ Efficient data transfer
- ✅ Database persistence
- ✅ Error handling at each layer
- ✅ Scalable design
- ✅ Clean separation of concerns
