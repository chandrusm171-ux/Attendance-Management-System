import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { X, Plus, Trash2 } from 'lucide-react'

const emptyExam = { subject: '', date: '', time: '', room: '' }

export default function AdminExams() {
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [modal, setModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [exams, setExams] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => {
    api.get('/students').then(r => setStudents(r.data))
    api.get('/subjects').then(r => setSubjects(r.data))
  }
  useEffect(() => { load() }, [])

  const openModal = (s) => {
    setSelected(s)
    setExams(s.examDates?.length > 0 ? [...s.examDates] : [{ ...emptyExam }])
    setMsg('')
    setModal(true)
  }

  const addExam = () => setExams([...exams, { ...emptyExam }])
  const removeExam = (i) => setExams(exams.filter((_, idx) => idx !== i))
  const updateExam = (i, field, value) => {
    const updated = [...exams]
    updated[i] = { ...updated[i], [field]: value }
    setExams(updated)
  }

  const submit = async () => {
    setLoading(true)
    try {
      await api.put(`/students/${selected._id}/exams`, exams)
      setMsg('Exam schedule saved!')
      load()
      setTimeout(() => { setMsg(''); setModal(false) }, 1500)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Exam Schedule</h2>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Student', 'Roll No', 'Department', 'Exams', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id} className="border-b hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 font-medium text-gray-800">{s.fullName}</td>
                  <td className="px-6 py-4 text-gray-500">{s.rollNumber}</td>
                  <td className="px-6 py-4 text-gray-500">{s.department}</td>
                  <td className="px-6 py-4">
                    {s.examDates?.length > 0 ? (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {s.examDates.length} exams
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openModal(s)}
                      className="px-4 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs font-semibold transition-all">
                      {s.examDates?.length > 0 ? 'Edit' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal && selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Assign Exam Schedule</h3>
                  <p className="text-sm text-gray-500">{selected.fullName} • {selected.rollNumber}</p>
                </div>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>

              <div className="space-y-3 mb-4">
                {exams.map((exam, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-xl items-center">
                    <select value={exam.subject} onChange={e => updateExam(i, 'subject', e.target.value)}
                      className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <option value="">Subject</option>
                      {subjects.map(s => <option key={s._id}>{s.subjectName}</option>)}
                    </select>
                    <input type="date" value={exam.date}
                      onChange={e => updateExam(i, 'date', e.target.value)}
                      className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <input type="time" value={exam.time}
                      onChange={e => updateExam(i, 'time', e.target.value)}
                      className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <div className="flex gap-2">
                      <input value={exam.room} onChange={e => updateExam(i, 'room', e.target.value)}
                        placeholder="Hall/Room"
                        className="border rounded-lg px-2 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      <button onClick={() => removeExam(i)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addExam}
                className="w-full py-2.5 border-2 border-dashed border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all mb-4">
                <Plus size={16} /> Add Exam
              </button>

              {msg && (
                <p className={`mb-3 text-sm text-center font-medium ${msg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
              )}
              <button onClick={submit} disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 font-semibold disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Exam Schedule'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}