import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { BookOpen, Users } from 'lucide-react'

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null)
  const [studentCount, setStudentCount] = useState(0)

  useEffect(() => {
    api.get('/teachers/me').then(r => setTeacher(r.data))
    api.get('/students').then(r => setStudentCount(r.data.length))
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {teacher?.fullName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
            <BookOpen size={28} className="mb-3 opacity-80" />
            <p className="text-3xl font-bold">{teacher?.subjects?.length || 0}</p>
            <p className="text-sm opacity-80 mt-1">Assigned Subjects</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
            <Users size={28} className="mb-3 opacity-80" />
            <p className="text-3xl font-bold">{studentCount}</p>
            <p className="text-sm opacity-80 mt-1">Total Students</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Your Subjects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teacher?.subjects?.map(s => (
              <div key={s._id} className="border rounded-xl p-4">
                <p className="font-medium text-gray-800">{s.subjectName}</p>
                <p className="text-sm text-gray-500">{s.class} • {s.department}</p>
              </div>
            ))}
          </div>
        </div>
        {teacher?.timetable?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
            <h3 className="font-semibold text-gray-700 mb-4">My Timetable</h3>
            <table className="w-full text-sm"><thead className="bg-gray-50"><tr>{['Day','Time','Subject','Class'].map(h=><th key={h} className="text-left px-4 py-2 text-gray-600">{h}</th>)}</tr></thead>
              <tbody>{teacher.timetable.map((t,i)=><tr key={i} className="border-t"><td className="px-4 py-2">{t.day}</td><td className="px-4 py-2">{t.time}</td><td className="px-4 py-2">{t.subject}</td><td className="px-4 py-2">{t.class}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}