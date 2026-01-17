import { statusCodeToStatus, isViolationStatus, isWorkDay } from '../utils/attendanceCalculator';
import type { AttendanceRecord, AttendanceStatusCode } from '../types';

// Centralized API service for fetching employees and attendance
export async function fetchEmployees(token?: string) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const res = await fetch(`${API_URL}/employees`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function fetchAttendance(token?: string): Promise<AttendanceRecord[]> {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const res = await fetch(`${API_URL}/attendance`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch attendance');
  
  const rawData = await res.json();
  
  // Transform raw data to match AttendanceRecord interface
  return rawData.map((record: any): AttendanceRecord => {
    // Backend returns status_code (snake_case)
    const statusCode = (record.status_code || record.statusCode) as AttendanceStatusCode;
    
    // Calculate derived properties
    return {
      employeeId: record.employee_id || record.employeeId,
      date: record.date.split('T')[0], // Ensure date string format YYYY-MM-DD
      statusCode,
      status: statusCodeToStatus(statusCode),
      isViolation: isViolationStatus(statusCode),
      isWorkDay: isWorkDay(statusCode)
    };
  });
}
