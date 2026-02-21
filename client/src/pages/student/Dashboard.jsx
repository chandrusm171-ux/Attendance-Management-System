import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { GraduationCap, CheckCircle, XCircle, Percent, DollarSign, Clock, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [attendance, setAttendance] = useState([])

  useEffect(() => {
    api.get('/students/me').then(r => setStudent(r.data))
    api.get('/attendance').then(r => setAttendance(r.data))
  }, [])

  const present = attendance.filter(a => a.status === 'Present').length
  const absent = attendance.length - present
  const percent = attendance.length ? Math.round((present / attendance.length) * 100) : 0
  const chartData = [{ name: 'Present', value: present }, { name: 'Absent', value: absent }]
  const percentColor = percent >= 75 ? 'text-green-600' : percent >= 50 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {student?.fullName} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">
            {student?.degree} • {student?.department} • Year {student?.year}
          </p>
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: CheckCircle, label: 'Present', value: present, color: 'from-green-500 to-green-600' },
            { icon: XCircle, label: 'Absent', value: absent, color: 'from-red-500 to-red-600' },
            { icon: GraduationCap, label: 'Total Classes', value: attendance.length, color: 'from-blue-500 to-blue-600' },
            { icon: Percent, label: 'Attendance', value: `${percent}%`, color: percent >= 75 ? 'from-indigo-500 to-indigo-600' : 'from-orange-500 to-orange-600' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5 shadow-lg`}>
              <Icon size={22} className="mb-2 opacity-80" />
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm opacity-80 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-3">Attendance Overview</h3>
            {attendance.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                    <Cell fill="#22c55e" /><Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
            )}
            <div className={`mt-2 p-2.5 rounded-xl text-xs font-medium text-center ${
              percent >= 75 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              {percent >= 75 ? '✅ Good standing' : `⚠️ Need ${Math.ceil((0.75 * attendance.length - present) / 0.25)} more classes for 75%`}
            </div>
          </div>

          {/* Fees */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <DollarSign size={16} className="text-indigo-500" /> Fee Status
            </h3>
            {student?.fees?.amount ? (
              <div className="space-y-3">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-800">₹{student.fees.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{student.fees.description || 'Total Fees'}</p>
                </div>
                <div className={`p-3 rounded-xl text-center font-semibold text-sm ${
                  student.fees.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {student.fees.paid ? '✓ PAID' : '✗ PAYMENT PENDING'}
                </div>
                {!student.fees.paid && student.fees.dueDate && (
                  <p className="text-xs text-center text-red-500 font-medium">
                    Due: {new Date(student.fees.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No fees assigned yet</p>
            )}
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-orange-500" /> Upcoming Exams
            </h3>
            {student?.examDates?.length > 0 ? (
              <div className="space-y-2">
                {student.examDates.slice(0, 4).map((exam, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-orange-50 rounded-xl border border-orange-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{exam.subject}</p>
                      <p className="text-xs text-gray-500">{exam.room && `Room: ${exam.room}`}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-orange-600">{exam.date}</p>
                      <p className="text-xs text-gray-500">{exam.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No exams scheduled</p>
            )}
          </div>
        </div>

        {/* Timetable */}
        {student?.timetable?.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" /> My Timetable
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Day', 'Time', 'Subject', 'Room'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-600 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.timetable.map((t, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-indigo-600">{t.day}</td>
                      <td className="px-4 py-3 text-gray-600">{t.time}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{t.subject}</td>
                      <td className="px-4 py-3 text-gray-500">{t.room || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}