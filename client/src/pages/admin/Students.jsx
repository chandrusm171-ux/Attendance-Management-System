import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const empty = { userId: '', fullName: '', rollNumber: '', degree: '', department: '', year: '', email: '', phone: '' }

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [users, setUsers] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  const load = () => {
    api.get('/students').then(r => setStudents(r.data))
    api.get('/auth/users').then(r => setUsers(r.data.filter(u => u.role === 'student')))
  }
  useEffect(load, [])

  const submit = async () => {
    if (editId) await api.put(`/students/${editId}`, form)
    else await api.post('/students', form)
    setModal(false); setForm(empty); setEditId(null); load()
  }

  const del = async id => { await api.delete(`/students/${id}`); load() }

  const openEdit = s => { setForm({ userId: s.userId, fullName: s.fullName, rollNumber: s.rollNumber, degree: s.degree, department: s.department, year: s.year, email: s.email, phone: s.phone }); setEditId(s._id); setModal(true) }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Students</h2>
          <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all">
            <Plus size={18} /> Add Student
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Name', 'Roll No', 'Degree', 'Dept', 'Year', 'Actions'].map(h => <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{s.fullName}</td>
                  <td className="px-6 py-4">{s.rollNumber}</td>
                  <td className="px-6 py-4">{s.degree}</td>
                  <td className="px-6 py-4">{s.department}</td>
                  <td className="px-6 py-4">{s.year}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(s)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Pencil size={16} /></button>
                    <button onClick={() => del(s._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg">{editId ? 'Edit' : 'Add'} Student</h3>
                <button onClick={() => { setModal(false); setForm(empty); setEditId(null) }}><X /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {!editId && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Link User Account</label>
                    <select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}
                      className="w-full border rounded-xl px-3 py-2 mt-1">
                      <option value="">Select user</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                    </select>
                  </div>
                )}
                {['fullName', 'rollNumber', 'degree', 'department', 'year', 'email', 'phone'].map(f => (
                  <div key={f}>
                    <label className="text-sm text-gray-600 capitalize">{f}</label>
                    <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                      className="w-full border rounded-xl px-3 py-2 mt-1" />
                  </div>
                ))}
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