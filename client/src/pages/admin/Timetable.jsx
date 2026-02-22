import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { X, Plus, Trash2, Clock } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const emptySlot = { day: 'Monday', time: '', subject: '', room: '' }

export default function AdminTimetable() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [modal, setModal] = useState(false)
  const [type, setType] = useState('student') // 'student' or 'teacher'
  const [selected, setSelected] = useState(null)
  const [slots, setSlots] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => {
    api.get('/students').then(r => setStudents(r.data))
    api.get('/teachers').then(r => setTeachers(r.data))
    api.get('/subjects').then(r => setSubjects(r.data))
  }
  useEffect(() => { load() }, [])

  const openModal = (item, t) => {
    setType(t)
    setSelected(item)
    setSlots(item.timetable?.length > 0 ? [...item.timetable] : [{ ...emptySlot }])
    setMsg('')
    setModal(true)
  }

  const addSlot = () => setSlots([...slots, { ...emptySlot }])
  const removeSlot = (i) => setSlots(slots.filter((_, idx) => idx !== i))
  const updateSlot = (i, field, value) => {
    const updated = [...slots]
    updated[i] = { ...updated[i], [field]: value }
    setSlots(updated)
  }

  const submit = async () => {
    setLoading(true)
    try {
      const url = type === 'student'
        ? `/students/${selected._id}/timetable`
        : `/teachers/${selected._id}/timetable`
      await api.put(url, slots)
      setMsg('Timetable saved!')
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Timetable Management</h2>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {['student', 'teacher'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm capitalize transition-all ${
                type === t ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}>
              {t} Timetables
            </button>
          ))}
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Name', type === 'student' ? 'Roll No' : 'Department', 'Slots', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(type === 'student' ? students : teachers).map(item => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 font-medium text-gray-800">{item.fullName}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {type === 'student' ? item.rollNumber : item.department}
                  </td>
                  <td className="px-6 py-4">
                    {item.timetable?.length > 0 ? (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        {item.timetable.length} slots
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openModal(item, type)}
                      className="px-4 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-all">
                      {item.timetable?.length > 0 ? 'Edit' : 'Assign'}
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
                  <h3 className="font-bold text-lg text-gray-800">Assign Timetable</h3>
                  <p className="text-sm text-gray-500 capitalize">{type}: {selected.fullName}</p>
                </div>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>

              <div className="space-y-3 mb-4">
                {slots.map((slot, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-xl items-center">
                    <select value={slot.day} onChange={e => updateSlot(i, 'day', e.target.value)}
                      className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      {DAYS.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <input type="time" value={slot.time}
                      onChange={e => updateSlot(i, 'time', e.target.value)}
                      className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    <select value={slot.subject} onChange={e => updateSlot(i, 'subject', e.target.value)}
                      className="border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <option value="">Subject</option>
                      {subjects.map(s => <option key={s._id}>{s.subjectName}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <input value={slot.room} onChange={e => updateSlot(i, 'room', e.target.value)}
                        placeholder="Room"
                        className="border rounded-lg px-2 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      <button onClick={() => removeSlot(i)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addSlot}
                className="w-full py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all mb-4">
                <Plus size={16} /> Add Time Slot
              </button>

              {msg && (
                <p className={`mb-3 text-sm text-center font-medium ${msg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
              )}
              <button onClick={submit} disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Timetable'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}