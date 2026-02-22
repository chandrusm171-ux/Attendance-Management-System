import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { Plus, Trash2, X, BookOpen, Pencil } from 'lucide-react'

const empty = { subjectName: '', class: '', department: '', teacherId: '' }

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [editId, setEditId] = useState(null)

  const load = () => {
    api.get('/subjects').then(r => setSubjects(r.data))
    api.get('/teachers').then(r => setTeachers(r.data))
  }
  useEffect(() => { load() }, [])

  const openEdit = (s) => {
    setEditId(s._id)
    setForm({
      subjectName: s.subjectName,
      class: s.class,
      department: s.department,
      teacherId: s.teacherId?._id || ''
    })
    setMsg('')
    setModal(true)
  }

  const openAdd = () => {
    setEditId(null)
    setForm(empty)
    setMsg('')
    setModal(true)
  }

  const submit = async () => {
    if (!form.subjectName || !form.class || !form.department) {
      setMsg('Subject name, class and department are required')
      return
    }
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/subjects/${editId}`, form)
        setMsg('Subject updated!')
      } else {
        await api.post('/subjects', form)
        setMsg('Subject created!')
      }
      setForm(empty)
      setEditId(null)
      load()
      setTimeout(() => { setMsg(''); setModal(false) }, 1500)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving subject')
    } finally {
      setLoading(false)
    }
  }

  const del = async id => {
    if (!confirm('Delete this subject?')) return
    await api.delete(`/subjects/${id}`)
    load()
  }

  const deptColors = {
    'CSE': 'bg-blue-100 text-blue-700',
    'ECE': 'bg-purple-100 text-purple-700',
    'EEE': 'bg-yellow-100 text-yellow-700',
    'MECH': 'bg-orange-100 text-orange-700',
    'CIVIL': 'bg-green-100 text-green-700',
    'IT': 'bg-pink-100 text-pink-700',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
            <p className="text-gray-500 text-sm mt-1">{subjects.length} subjects total</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all">
            <Plus size={18} /> Add Subject
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No subjects yet</p>
            <p className="text-sm">Create your first subject to assign to teachers</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map(s => (
              <div key={s._id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <BookOpen size={20} className="text-indigo-600" />
                  </div>
                  {/*  Edit + Delete buttons */}
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)}
                      className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit subject">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => del(s._id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete subject">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{s.subjectName}</h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    Class: {s.class}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${deptColors[s.department] || 'bg-gray-100 text-gray-600'}`}>
                    {s.department}
                  </span>
                </div>
                <p className="text-indigo-600 text-sm mt-2 font-medium">
                  {s.teacherId?.fullName ? `👤 ${s.teacherId.fullName}` : '⚠️ No teacher assigned'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-gray-800">
                  {editId ? 'Edit Subject' : 'Add Subject'}
                </h3>
                <button onClick={() => { setModal(false); setMsg(''); setEditId(null) }}
                  className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Subject Name *</label>
                  <input
                    value={form.subjectName}
                    onChange={e => setForm({ ...form, subjectName: e.target.value })}
                    placeholder="e.g. Mathematics, Physics"
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Class *</label>
                  <input
                    value={form.class}
                    onChange={e => setForm({ ...form, class: e.target.value })}
                    placeholder="e.g. 1st Year, 2nd Year"
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department *</label>
                  <select
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Select Department</option>
                    {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MBA', 'MCA', 'Other'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assign Teacher (optional)</label>
                  <select
                    value={form.teacherId}
                    onChange={e => setForm({ ...form, teacherId: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">None</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t._id}>{t.fullName} ({t.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              {msg && (
                <p className={`mt-3 text-sm text-center font-medium ${msg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {msg}
                </p>
              )}

              <button onClick={submit} disabled={loading}
                className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold disabled:opacity-50">
                {loading ? 'Saving...' : editId ? 'Update Subject' : 'Create Subject'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}