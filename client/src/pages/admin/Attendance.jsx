import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { Filter, Users, BookOpen, TrendingUp } from 'lucide-react'

export default function AdminAttendance() {
  const [records, setRecords] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState({ subjectId: '', studentId: '', date: '', status: '' })
  const [loading, setLoading] = useState(false)

  // Load subjects and students for filter dropdowns
  useEffect(() => {
    api.get('/subjects').then(r => setSubjects(r.data))
    api.get('/students').then(r => setStudents(r.data))
    loadRecords() // ← Load ALL records on mount
  }, [])

  const loadRecords = async (customFilter) => {
    setLoading(true)
    try {
      const f = customFilter || filter
      const params = new URLSearchParams()
      if (f.subjectId) params.append('subjectId', f.subjectId)
      if (f.studentId) params.append('studentId', f.studentId)
      if (f.date) params.append('date', f.date)
      const { data } = await api.get(`/attendance?${params}`)
      // Filter by status client-side
      const filtered = f.status
        ? data.filter(r => r.status === f.status)
        : data
      setRecords(filtered)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetFilter = () => {
    const cleared = { subjectId: '', studentId: '', date: '', status: '' }
    setFilter(cleared)
    loadRecords(cleared)
  }

  const present = records.filter(r => r.status === 'Present').length
  const absent = records.filter(r => r.status === 'Absent').length
  const rate = records.length ? Math.round((present / records.length) * 100) : 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Records</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-3xl font-bold text-gray-800">{records.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Records</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-3xl font-bold text-green-600">{present}</p>
            <p className="text-sm text-gray-500 mt-1">Present</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-3xl font-bold text-red-500">{absent}</p>
            <p className="text-sm text-gray-500 mt-1">Absent</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border mb-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Subject</label>
              <select
                value={filter.subjectId}
                onChange={e => setFilter({ ...filter, subjectId: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s._id} value={s._id}>{s.subjectName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Student</label>
              <select
                value={filter.studentId}
                onChange={e => setFilter({ ...filter, studentId: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">All Students</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.fullName} ({s.rollNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Date</label>
              <input
                type="date"
                value={filter.date}
                onChange={e => setFilter({ ...filter, date: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Status</label>
              <select
                value={filter.status}
                onChange={e => setFilter({ ...filter, status: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <button
              onClick={() => loadRecords()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-indigo-700 transition-all"
            >
              <Filter size={15} /> Apply Filter
            </button>
            <button
              onClick={resetFilter}
              className="px-5 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
          {loading ? (
            <p className="text-center text-gray-400 py-12">Loading...</p>
          ) : records.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No attendance records found</p>
              <p className="text-sm mt-1">Records appear here once teachers mark attendance</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['#', 'Student', 'Roll No', 'Subject', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r._id} className="border-b hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{r.studentId?.fullName || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{r.studentId?.rollNumber || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{r.subjectId?.subjectName || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{r.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}