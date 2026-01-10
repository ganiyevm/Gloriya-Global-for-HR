# Using the API Service in React Components

## Overview
The `src/services/api.ts` module provides a simple, centralized way to communicate with the backend API.

## Import the Service

```typescript
import { authAPI, employeeAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
```

## Authentication Example

### Login
```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginComponent() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    const result = await login('admin', 'password123');
    if (result.success) {
      // Redirect to dashboard
    } else {
      console.error(result.error);
    }
  };
}
```

## Using in Components

### Get All Employees

```typescript
import { useEffect, useState } from 'react';
import { employeeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function EmployeeList() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadEmployees = async () => {
      try {
        const data = await employeeAPI.getAll(user.token);
        setEmployees(data);
      } catch (error) {
        console.error('Failed to load employees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {employees.map(emp => (
        <div key={emp.id}>{emp.name}</div>
      ))}
    </div>
  );
}
```

### Create an Employee

```typescript
import { employeeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function CreateEmployee() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeAPI.create(formData, user!.token);
      alert('Employee created successfully');
      setFormData({ name: '', email: '', department: '', position: '' });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Employee Name"
      />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Update an Employee

```typescript
const handleUpdate = async (id: number) => {
  try {
    await employeeAPI.update(id, {
      name: 'New Name',
      department: 'New Department'
    }, user!.token);
    alert('Employee updated');
  } catch (error) {
    alert(`Error: ${error}`);
  }
};
```

### Delete an Employee

```typescript
const handleDelete = async (id: number) => {
  if (confirm('Are you sure?')) {
    try {
      await employeeAPI.delete(id, user!.token);
      alert('Employee deleted');
      // Refresh list
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }
};
```

## Attendance Operations

### Get Attendance Records

```typescript
import { attendanceAPI } from '../services/api';

function AttendanceView() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const data = await attendanceAPI.getAll(user.token, {
          employeeId: 1,
          date: '2025-01-15'
        });
        setRecords(data);
      } catch (error) {
        console.error('Failed to load:', error);
      }
    };

    load();
  }, [user]);

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>
          {record.date}: {record.status_code}
        </div>
      ))}
    </div>
  );
}
```

### Create Single Attendance Record

```typescript
const handleAddAttendance = async () => {
  try {
    await attendanceAPI.create({
      employeeId: 1,
      date: '2025-01-15',
      statusCode: 'W'
    }, user!.token);
    alert('Record added');
  } catch (error) {
    alert(`Error: ${error}`);
  }
};
```

### Bulk Import Attendance

```typescript
import { attendanceAPI } from '../services/api';

// This is already implemented in FileImport.tsx
const handleBulkImport = async (records: any[]) => {
  try {
    const response = await attendanceAPI.bulkImport(records, user!.token);
    console.log(`Imported ${response.successCount} records`);
  } catch (error) {
    console.error('Bulk import failed:', error);
  }
};
```

## Error Handling Pattern

```typescript
async function safeAPICall() {
  try {
    const data = await employeeAPI.getAll(user!.token);
    // Process data
  } catch (error) {
    if (error instanceof Error) {
      console.error('API Error:', error.message);
      // Show error to user
      setError(error.message);
    } else {
      console.error('Unknown error:', error);
      setError('An unexpected error occurred');
    }
  }
}
```

## Custom Hook Pattern

### useEmployees Hook

```typescript
import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function useEmployees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const data = await employeeAPI.getAll(user.token);
        setEmployees(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return { employees, loading, error };
}

// Usage:
function MyComponent() {
  const { employees, loading } = useEmployees();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {employees.map(emp => <div key={emp.id}>{emp.name}</div>)}
    </div>
  );
}
```

### useAttendance Hook

```typescript
import { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function useAttendance(filters?: { employeeId?: number; date?: string }) {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!user) return;
    try {
      const data = await attendanceAPI.getAll(user.token, filters);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user, filters?.employeeId, filters?.date]);

  return { records, loading, error, refresh };
}

// Usage:
function AttendanceReport() {
  const { records } = useAttendance({ date: '2025-01-15' });
  
  return (
    <div>
      {records.map(r => <div key={r.id}>{r.employee_name}: {r.status_code}</div>)}
    </div>
  );
}
```

## Complete Example: Employee Management Component

```typescript
import { useEffect, useState } from 'react';
import { employeeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function EmployeeManagement() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: ''
  });

  const loadEmployees = async () => {
    if (!user) return;
    try {
      const data = await employeeAPI.getAll(user.token);
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [user]);

  const handleCreate = async () => {
    try {
      await employeeAPI.create(newEmployee, user!.token);
      setNewEmployee({ name: '', email: '', department: '' });
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await employeeAPI.delete(id, user!.token);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-bold mb-2">Add Employee</h3>
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
        />
        <Button onClick={handleCreate}>Add</Button>
      </Card>

      <div className="space-y-2">
        {employees.map(emp => (
          <Card key={emp.id} className="p-3 flex justify-between items-center">
            <div>
              <div className="font-bold">{emp.name}</div>
              <div className="text-sm text-gray-600">{emp.department}</div>
            </div>
            <Button onClick={() => handleDelete(emp.id)} variant="destructive">
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## API Response Types

### Success Response
```typescript
{
  "message": "Operation successful",
  "data": {/* resource data */}
}
```

### Error Response
```typescript
{
  "error": "Error message describing what went wrong"
}
```

### Bulk Import Response
```typescript
{
  "message": "Bulk import completed",
  "successCount": 150,
  "totalCount": 150,
  "errors": ["optional error details"]
}
```

## Best Practices

1. **Always check user exists** before API calls
   ```typescript
   if (!user) return;
   ```

2. **Use try-catch blocks** for all API calls
   ```typescript
   try {
     const data = await employeeAPI.getAll(user.token);
   } catch (error) {
     handleError(error);
   }
   ```

3. **Create custom hooks** for common data fetching patterns
   ```typescript
   const { data, loading, error } = useEmployees();
   ```

4. **Show loading states** while fetching
   ```typescript
   if (loading) return <Spinner />;
   ```

5. **Handle errors gracefully** with user feedback
   ```typescript
   if (error) return <Alert variant="destructive">{error}</Alert>;
   ```

---

For more examples, check the `FileImport.tsx` component which uses `attendanceAPI.bulkImport()` extensively.
