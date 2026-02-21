import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { User, Mail, Phone, BookOpen, Hash, GraduationCap, Building } from 'lucide-react'

export default function StudentProfile() {
  const [student, setStudent] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get('/students/me').then(r => setStudent(r.data))
    api.get('/auth/me').then(r => setUser(r.data))
  }, [])

  const imgSrc = user?.profileImage ? `http://localhost:5000${user.profileImage}` : null

  const infoItems = [
    { icon: Hash, label: 'Roll Number', value: student?.rollNumber },
    { icon: GraduationCap, label: 'Degree', value: student?.degree },
    { icon: Building, label: 'Department', value: student?.department },
    { icon: BookOpen, label: 'Year', value: student?.year },
    { icon: Mail, label: 'Email', value: student?.email },
    { icon: Phone, label: 'Phone', value: student?.phone },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {/* Cover */}
            <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="px-6 pb-6">
              <div className="flex items-end gap-5 -mt-12 mb-5">
                {/* Avatar — view only, no upload */}
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-indigo-100 overflow-hidden flex items-center justify-center">
                  {imgSrc ? (
                    <img src={imgSrc} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-indigo-400" />
                  )}
                </div>
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{student?.fullName || 'Student'}</h3>
                  <p className="text-indigo-600 text-sm font-medium">@{user?.username}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Profile picture is managed by Admin</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap mb-5">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Student</span>
                {student?.department && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">{student.department}</span>
                )}
                {student?.year && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Year {student.year}</span>
                )}
                {student?.degree && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{student.degree}</span>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm shrink-0">
                      <Icon size={15} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}