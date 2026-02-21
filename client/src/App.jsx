import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents from './pages/admin/Students'
import AdminTeachers from './pages/admin/Teachers'
import AdminSubjects from './pages/admin/Subjects'
import AdminAttendance from './pages/admin/Attendance'
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherAttendance from './pages/teacher/Attendance'
import StudentDashboard from './pages/student/Dashboard'
import StudentAttendance from './pages/student/Attendance'
import ProtectedRoute from './components/ProtectedRoute'
import AdminUsers from './pages/admin/Users'
import AdminProfile from './pages/admin/Profile'
import TeacherProfile from './pages/teacher/Profile'
import StudentProfile from './pages/student/Profile'
import AdminFees from './pages/admin/Fees'
import AdminTimetable from './pages/admin/Timetable'
import AdminExams from './pages/admin/Exams'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute role="admin" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="exams" element={<AdminExams />} />

      </Route>
      <Route path="/teacher" element={<ProtectedRoute role="teacher" />}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>
      <Route path="/student" element={<ProtectedRoute role="student" />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}