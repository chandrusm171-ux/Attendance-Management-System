import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, ClipboardList, LogOut, GraduationCap, UserCog, UserCircle, DollarSign, Clock, Calendar } from 'lucide-react'

const links = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/profile', label: 'My Profile', icon: UserCircle },   // ← ADD
    { to: '/admin/users', label: 'User Accounts', icon: UserCog },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/teachers', label: 'Teachers', icon: Users },
    { to: '/admin/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
    { to: '/admin/fees', label: 'Fees', icon: DollarSign },
    { to: '/admin/timetable', label: 'Timetable', icon: Clock },
    { to: '/admin/exams', label: 'Exam Dates', icon: Calendar },
  ],
  teacher: [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/profile', label: 'My Profile', icon: UserCircle },  // ← ADD
    { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardList },
  ],
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: UserCircle },  // ← ADD
    { to: '/student/attendance', label: 'Attendance', icon: ClipboardList },
  ],
}


export default function Sidebar() {
  const role = localStorage.getItem('role')
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col">
      <div className="p-6 border-b border-indigo-700">
        <h1 className="text-xl font-bold tracking-wide">SmartAttend</h1>
        <p className="text-indigo-300 text-sm capitalize">{role} Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {(links[role] || []).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
              ${isActive ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-indigo-200 hover:bg-white/10 text-sm transition-all">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  )
}