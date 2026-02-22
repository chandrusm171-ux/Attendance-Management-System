import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { X, DollarSign, CheckCircle, XCircle } from 'lucide-react'

export default function AdminFees() {
  const [students, setStudents] = useState([])
  const [modal, setModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ amount: '', paid: false, dueDate: '', description: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => api.get('/students').then(r => setStudents(r.data))
  useEffect(() => { load() }, [])

  const openModal = (s) => {
    setSelected(s)
    setForm({
      amount: s.fees?.amount || '',
      paid: s.fees?.paid || false,
      dueDate: s.fees?.dueDate || '',
      description: s.fees?.description || ''
    })
    setMsg('')
    setModal(true)
  }

  const submit = async () => {
    setLoading(true)
    try {
      await api.put(`/students/${selected._id}/fees`, {
        amount: Number(form.amount),
        paid: form.paid,
        dueDate: form.dueDate,
        description: form.description
      })
      setMsg('Fees updated!')
      load()
      setTimeout(() => { setMsg(''); setModal(false) }, 1500)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const totalFees = students.reduce((sum, s) => sum + (s.fees?.amount || 0), 0)
  const paidCount = students.filter(s => s.fees?.paid).length
  const unpaidCount = students.filter(s => s.fees?.amount > 0 && !s.fees?.paid).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Fees Management</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-5 shadow-lg">
            <DollarSign size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">₹{totalFees.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-1">Total Fees Assigned</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-5 shadow-lg">
            <CheckCircle size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">{paidCount}</p>
            <p className="text-sm opacity-80 mt-1">Paid</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-5 shadow-lg">
            <XCircle size={24} className="mb-2 opacity-80" />
            <p className="text-3xl font-bold">{unpaidCount}</p>
            <p className="text-sm opacity-80 mt-1">Pending</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Student', 'Roll No', 'Amount', 'Due Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-600 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id} className="border-b hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 font-medium text-gray-800">{s.fullName}</td>
                  <td className="px-6 py-4 text-gray-500">{s.rollNumber}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {s.fees?.amount ? `₹${s.fees.amount.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{s.fees?.dueDate || '—'}</td>
                  <td className="px-6 py-4">
                    {s.fees?.amount ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        s.fees.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {s.fees.paid ? '✓ Paid' : '✗ Pending'}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openModal(s)}
                      className="px-4 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-all">
                      Assign / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal && selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Assign Fees</h3>
                  <p className="text-sm text-gray-500">{selected.fullName} • {selected.rollNumber}</p>
                </div>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Fee Amount (₹)</label>
                  <input type="number" value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <input type="date" value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description (optional)</label>
                  <input value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. Semester 1 fees"
                    className="w-full border rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Status</label>
                  <div className="flex gap-3 mt-2">
                    <button type="button"
                      onClick={() => setForm({ ...form, paid: false })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        !form.paid ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-200 text-gray-400'
                      }`}>
                      ✗ Pending
                    </button>
                    <button type="button"
                      onClick={() => setForm({ ...form, paid: true })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.paid ? 'border-green-400 bg-green-50 text-green-600' : 'border-gray-200 text-gray-400'
                      }`}>
                      ✓ Paid
                    </button>
                  </div>
                </div>
              </div>
              {msg && (
                <p className={`mt-3 text-sm text-center font-medium ${msg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
              )}
              <button onClick={submit} disabled={loading}
                className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Fees'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}