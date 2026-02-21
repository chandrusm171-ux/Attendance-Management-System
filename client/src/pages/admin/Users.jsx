import { useEffect, useState, useRef } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { Plus, Trash2, X, Camera, Pencil } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({ username: '', password: '' })
  const [form, setForm] = useState({ username: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [editMsg, setEditMsg] = useState('')
  const [uploadingId, setUploadingId] = useState(null)
  const [activeUploadUser, setActiveUploadUser] = useState(null)
  const fileInputRef = useRef()

  const load = () => api.get('/auth/users').then(r => setUsers(r.data))
  useEffect(() => { load() }, [])

  const handleUserPhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !activeUploadUser) return
    setUploadingId(activeUploadUser)
    try {
      const fd = new FormData()
      fd.append('profileImage', file)
      await api.put(`/auth/users/${activeUploadUser}/profile-image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('✅ Photo updated!')
      load()
    } catch {
      alert('Failed to upload photo')
    } finally {
      setUploadingId(null)
      setActiveUploadUser(null)
      e.target.value = ''
    }
  }

  const openEdit = (u) => {
    setEditUser(u)
    setEditForm({ username: u.username, password: '' })
    setEditMsg('')
    setEditModal(true)
  }

  const submitEdit = async () => {
    if (!editForm.username) {
      setEditMsg('Username is required')
      return
    }
    setEditLoading(true)
    try {
      await api.put(`/auth/users/${editUser._id}`, {
        username: editForm.username.trim(),
        ...(editForm.password && { password: editForm.password })
      })
      setEditMsg('✅ User updated!')
      load()
      setTimeout(() => { setEditMsg(''); setEditModal(false) }, 1500)
    } catch (err) {
      setEditMsg(err.response?.data?.message || 'Error updating user')
    } finally {
      setEditLoading(false)
    }
  }

  const submit = async () => {
    if (!form.username || !form.password || !form.role) {
      setMsg('All fields are required')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', form.username.trim())
      formData.append('password', form.password)
      formData.append('role', form.role.toLowerCase())
      await api.post('/auth/create-user', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMsg('✅ User created!')
      setForm({ username: '', password: '', role: 'student' })
      load()
      setTimeout(() => { setMsg(''); setModal(false) }, 1500)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error creating user')
    } finally {
      setLoading(false)
    }
  }

  const del = async id => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/auth/users/${id}`)
    load()
  }

  const roleColor = role => ({
    admin: 'bg-purple-100 text-purple-700',
    teacher: 'bg-blue-100 text-blue-700',
    student: 'bg-green-100 text-green-700'
  }[role])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Accounts</h2>
            <p className="text-gray-500 text-sm mt-1">Create login credentials for teachers and students</p>
          </div>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all">
            <Plus size={18} /> Create User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['admin', 'teacher', 'student'].map(role => (
            <div key={role} className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.role === role).length}
              </p>
              <p className="text-sm text-gray-500 capitalize mt-1">{role}s</p>
            </div>
          ))}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUserPhotoUpload}
        />

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Username', 'Role', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center shrink-0">
                        {u.profileImage ? (
                          <img src={`http://localhost:5000${u.profileImage}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-indigo-500 text-xs font-bold">
                            {u.username?.[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {u.username}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  {/* ✅ Three action buttons: Edit + Camera + Delete */}
                  <td className="px-6 py-4">
                    <div className="flex gap-1 items-center">
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(u)}
                        title="Edit username/password"
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Pencil size={15} />
                      </button>

                      {/* Upload Photo */}
                      <button
                        onClick={() => { setActiveUploadUser(u._id); fileInputRef.current.click() }}
                        title="Upload profile photo"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        {uploadingId === u._id
                          ? <span className="text-xs text-blue-400">...</span>
                          : <Camera size={15} />
                        }
                      </button>

                      {/* Delete — not for admin */}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => del(u._id)}
                          title="Delete user"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-400 py-12">No users yet. Create your first user!</p>
          )}
        </div>

        {/* Create User Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-gray-800">Create New User</h3>
                <button onClick={() => { setModal(false); setMsg('') }}
                  className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Role</label>
                  <select value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Username</label>
                  <input value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    placeholder="e.g. john_doe"
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Password</label>
                  <input value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Set a password"
                    type="text"
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
              {msg && (
                <p className={`mt-3 text-sm text-center font-medium ${msg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {msg}
                </p>
              )}
              <button onClick={submit} disabled={loading}
                className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold disabled:opacity-50">
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        )}

        {/* ✅ Edit User Modal */}
        {editModal && editUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Edit User</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Role: <span className="capitalize font-medium">{editUser.role}</span>
                  </p>
                </div>
                <button onClick={() => { setEditModal(false); setEditMsg('') }}
                  className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Username</label>
                  <input
                    value={editForm.username}
                    onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">
                    New Password
                    <span className="text-gray-400 font-normal ml-1">(leave blank to keep current)</span>
                  </label>
                  <input
                    value={editForm.password}
                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Enter new password"
                    type="text"
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
              {editMsg && (
                <p className={`mt-3 text-sm text-center font-medium ${editMsg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {editMsg}
                </p>
              )}
              <button onClick={submitEdit} disabled={editLoading}
                className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold disabled:opacity-50">
                {editLoading ? 'Saving...' : 'Update User'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}