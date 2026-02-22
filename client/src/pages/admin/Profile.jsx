import { useEffect, useState, useRef } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { Camera, User, Shield, Users, GraduationCap, BookOpen } from 'lucide-react'

export default function AdminProfile() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ students: 0, teachers: 0, subjects: 0 })
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const fileRef = useRef()

  useEffect(() => {
    api.get('/auth/me').then(r => setUser(r.data))
    Promise.all([
      api.get('/students'),
      api.get('/teachers'),
      api.get('/subjects'),
    ]).then(([s, t, sub]) => setStats({
      students: s.data.length,
      teachers: t.data.length,
      subjects: sub.data.length,
    }))
  }, [])

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('profileImage', file)
      const { data } = await api.put('/auth/profile-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      localStorage.setItem('profileImage', data.profileImage)
      setUser(u => ({ ...u, profileImage: data.profileImage }))
      setSuccessMsg('Profile picture updated!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const imgSrc = preview || (user?.profileImage ? `http://localhost:5000${user.profileImage}` : null)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h2>

        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
            {/* Cover */}
            <div className="h-28 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />

            <div className="px-6 pb-6">
              <div className="flex items-end gap-5 -mt-12 mb-4">
                {/* Avatar with upload */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-violet-100 overflow-hidden flex items-center justify-center">
                    {imgSrc ? (
                      <img src={imgSrc} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-violet-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current.click()}
                    disabled={uploading}
                    title="Change profile picture"
                    className="absolute -bottom-2 -right-2 bg-violet-600 text-white p-1.5 rounded-lg shadow-md hover:bg-violet-700 transition-all"
                  >
                    <Camera size={14} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div className="mb-2 flex-1">
                  <h3 className="text-xl font-bold text-gray-800">Administrator</h3>
                  <p className="text-violet-600 text-sm font-medium">@{user?.username}</p>
                </div>

                <div className="mb-2 text-right">
                  {uploading && <p className="text-xs text-violet-500">Uploading...</p>}
                  {successMsg && <p className="text-xs text-green-600 font-medium">{successMsg}</p>}
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileRef.current.click()}
                disabled={uploading}
                className="w-full mb-5 flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl py-3 text-sm font-medium transition-all"
              >
                <Camera size={16} />
                {uploading ? 'Uploading...' : 'Upload / Change Profile Picture'}
              </button>

              {/* Badges */}
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Shield size={11} /> Admin
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Full Access</span>
              </div>

              {/* Note about managing others' photos */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-5">
                <p className="text-sm text-blue-700 font-medium">📸 Managing Profile Pictures</p>
                <p className="text-xs text-blue-500 mt-1">
                  You can upload profile pictures for teachers and students via the
                  <strong> User Accounts</strong> page → select a user → upload their photo.
                </p>
              </div>

              {/* Stats */}
              <p className="text-sm font-semibold text-gray-600 mb-3">System Overview</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center border border-blue-100">
                  <GraduationCap size={20} className="text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">{stats.students}</p>
                  <p className="text-xs text-blue-500 mt-1">Students</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center border border-purple-100">
                  <Users size={20} className="text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">{stats.teachers}</p>
                  <p className="text-xs text-purple-500 mt-1">Teachers</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl text-center border border-indigo-100">
                  <BookOpen size={20} className="text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-indigo-700">{stats.subjects}</p>
                  <p className="text-xs text-indigo-500 mt-1">Subjects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}