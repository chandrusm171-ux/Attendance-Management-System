import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'

export default function TeacherAttendance() {
  const [teacher, setTeacher] = useState(null)
  const [students, setStudents] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [statuses, setStatuses] = useState({})
  const [records, setRecords] = useState([])
  const [view, setView] = useState('mark')

  useEffect(() => {
    api.get('/teachers/me').then(r => setTeacher(r.data))
    api.get('/students').then(r => setStudents(r.data))
  }, [])

  useEffect(() => {
    if (view === 'history') api.get('/attendance').then(r => setRecords(r.data))
  }, [view])

  const toggle = id => setStatuses(s => ({ ...s, [id]: s[id] === 'Present' ? 'Absent' : 'Present' }))

  const submit = async () => {
    const payload = students.map(s => ({
      studentId: s._id, subjectId: selectedSubject, date, status: statuses[s._id] || 'Absent'
    }))
    await api.post('/attendance', payload)
    alert('Attendance saved!')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance</h2>
        <div className="flex gap-3 mb-6">
          <button onClick={() => setView('mark')} className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${view === 'mark' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'}`}>Mark Attendance</button>
          <button onClick={() => setView('history')} className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${view === 'history' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'}`}>History</button>
        </div>

        {view === 'mark' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex gap-4 mb-6">
              <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="border rounded-xl px-4 py-2 text-sm">
                <option value="">Select Subject</option>
                {teacher?.subjects?.map(s => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
              </select>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded-xl px-4 py-2 text-sm" />
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b"><tr>
                <th className="text-left px-4 py-3 text-gray-600">Student</th>
                <th className="text-left px-4 py-3 text-gray-600">Roll</th>
                <th className="text-left px-4 py-3 text-gray-600">Status</th>
              </tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} className="border-b">
                    <td className="px-4 py-3">{s.fullName}</td>
                    <td className="px-4 py-3">{s.rollNumber}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(s._id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${statuses[s._id] === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {statuses[s._id] || 'Absent'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={submit} className="mt-5 bg-indigo-600 text-white px-8 py-2.5 rounded-xl hover:bg-indigo-700">Save Attendance</button>
          </div>
        )}

        {view === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b"><tr>
                {['Student', 'Subject', 'Date', 'Status'].map(h => <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{r.studentId?.fullName}</td>
                    <td className="px-6 py-4">{r.subjectId?.subjectName}</td>
                    <td className="px-6 py-4">{r.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}