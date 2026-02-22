import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BookOpen, CheckCircle, XCircle, Percent } from 'lucide-react'

export default function StudentAttendance() {
  const [records, setRecords] = useState([])
  const [subjects, setSubjects] = useState([])
  const [filterSubject, setFilterSubject] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/attendance'),
      api.get('/subjects')
    ]).then(([attRes, subRes]) => {
      setRecords(attRes.data)
      setSubjects(subRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Filter records by subject
  const filtered = filterSubject
    ? records.filter(r => r.subjectId?._id === filterSubject)
    : records

  const present = filtered.filter(r => r.status === 'Present').length
  const absent = filtered.filter(r => r.status === 'Absent').length
  const total = filtered.length
  const percentage = total ? Math.round((present / total) * 100) : 0

  const chartData = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ]

  const percentColor = percentage >= 75 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-500'

  // Per-subject breakdown
  const subjectBreakdown = subjects.map(sub => {
    const subRecords = records.filter(r => r.subjectId?._id === sub._id)
    const p = subRecords.filter(r => r.status === 'Present').length
    const pct = subRecords.length ? Math.round((p / subRecords.length) * 100) : 0
    return { ...sub, total: subRecords.length, present: p, absent: subRecords.length - p, percentage: pct }
  }).filter(s => s.total > 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Attendance</h2>

        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading attendance...</p>
        ) : records.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No attendance records yet</p>
            <p className="text-sm">Your attendance will appear here once your teacher marks it</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-xl"><BookOpen size={18} className="text-blue-600" /></div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{total}</p>
                <p className="text-sm text-gray-500 mt-1">Total Classes</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 rounded-xl"><CheckCircle size={18} className="text-green-600" /></div>
                </div>
                <p className="text-3xl font-bold text-green-600">{present}</p>
                <p className="text-sm text-gray-500 mt-1">Present</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-50 rounded-xl"><XCircle size={18} className="text-red-500" /></div>
                </div>
                <p className="text-3xl font-bold text-red-500">{absent}</p>
                <p className="text-sm text-gray-500 mt-1">Absent</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-50 rounded-xl"><Percent size={18} className="text-indigo-600" /></div>
                </div>
                <p className={`text-3xl font-bold ${percentColor}`}>{percentage}%</p>
                <p className="text-sm text-gray-500 mt-1">Attendance Rate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-700 mb-4">Overview</h3>
                {total > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" outerRadius={75} dataKey="value">
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Attendance Warning */}
                {percentage < 75 && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 text-xs font-medium">
                       Attendance below 75% — you need {Math.ceil((0.75 * total - present) / 0.25)} more classes to reach 75%
                    </p>
                  </div>
                )}
                {percentage >= 75 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-green-600 text-xs font-medium">
                       Good attendance! Keep it up.
                    </p>
                  </div>
                )}
              </div>

              {/* Subject-wise Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border lg:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-4">Subject-wise Breakdown</h3>
                {subjectBreakdown.length === 0 ? (
                  <p className="text-gray-400 text-sm">No subject data yet</p>
                ) : (
                  <div className="space-y-3">
                    {subjectBreakdown.map(s => (
                      <div key={s._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{s.subjectName}</span>
                          <span className={`font-semibold ${s.percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                            {s.percentage}% ({s.present}/{s.total})
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${s.percentage >= 75 ? 'bg-green-500' : 'bg-red-400'}`}
                            style={{ width: `${s.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter + Records Table */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-5 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Attendance Records</h3>
                <select
                  value={filterSubject}
                  onChange={e => setFilterSubject(e.target.value)}
                  className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id}>{s.subjectName}</option>
                  ))}
                </select>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['#', 'Subject', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r._id} className="border-b hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{r.subjectId?.subjectName || '—'}</td>
                      <td className="px-6 py-4 text-gray-500">{r.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {r.status === 'Present' ? '✓ Present' : '✗ Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}