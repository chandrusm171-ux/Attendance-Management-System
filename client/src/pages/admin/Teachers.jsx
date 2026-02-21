import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const empty = { userId: '', fullName: '', email: '', department: '', qualification: '', subjects: [] }

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([])
  const [users, setUsers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  const load = () => {
    api.get('/teachers').then(r => setTeachers(r.data))
    api.get('/auth/users').then(r => setUsers(r.data.filter(u => u.role === 'teacher')))
    api.get('/subjects').then(r => setSubjects(r.data))
  }
  useEffect(load, [])

  const submit = async () => {
    if (editId) await api.put(`/teachers/${editId}`, form)
    else await api.post('/teachers', form)
    setModal(false); setForm(empty); setEditId(null); load()
  }

  const del = async id => { await api.delete(`/teachers/${id}`); load() }

  const toggleSubject = id => setForm(f => ({
    ...f, subjects: f.subjects.includes(id) ? f.subjects.filter(s => s !== id) : [...f.subjects, id]
  }))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
          <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700">
            <Plus size={18} /> Add Teacher
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Name', 'Email', 'Dept', 'Subjects', 'Actions'].map(h => <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{t.fullName}</td>
                  <td className="px-6 py-4">{t.email}</td>
                  <td className="px-6 py-4">{t.department}</td>
                  <td className="px-6 py-4">{t.subjects?.map(s => s.subjectName).join(', ')}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => { setForm({ userId: t.userId, fullName: t.fullName, email: t.email, department: t.department, qualification: t.qualification, subjects: t.subjects?.map(s => s._id) || [] }); setEditId(t._id); setModal(true) }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Pencil size={16} /></button>
                    <button onClick={() => del(t._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg">{editId ? 'Edit' : 'Add'} Teacher</h3>
                <button onClick={() => { setModal(false); setForm(empty); setEditId(null) }}><X /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {!editId && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Link User Account</label>
                    <select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} className="w-full border rounded-xl px-3 py-2 mt-1">
                      <option value="">Select user</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                    </select>
                  </div>
                )}
                {['fullName', 'email', 'department', 'qualification'].map(f => (
                  <div key={f}>
                    <label className="text-sm text-gray-600 capitalize">{f}</label>
                    <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} className="w-full border rounded-xl px-3 py-2 mt-1" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Assign Subjects</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subjects.map(s => (
                      <button key={s._id} type="button" onClick={() => toggleSubject(s._id)}
                        className={`px-3 py-1 rounded-full text-sm border transition-all ${form.subjects.includes(s._id) ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 border-gray-300'}`}>
                        {s.subjectName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={submit} className="mt-5 w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700">
                {editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}