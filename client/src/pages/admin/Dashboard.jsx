import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../utils/api'
import { Users, GraduationCap, BookOpen, ClipboardList } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, subjects: 0, attendance: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/teachers'),
      api.get('/subjects'),
      api.get('/attendance'),
    ]).then(([s, t, sub, a]) => setStats({
      students: s.data.length,
      teachers: t.data.length,
      subjects: sub.data.length,
      attendance: a.data.length,
    }))
  }, [])

  const cards = [
    { label: 'Total Students', value: stats.students, icon: GraduationCap, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Teachers', value: stats.teachers, icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Subjects', value: stats.subjects, icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Attendance Records', value: stats.attendance, icon: ClipboardList, color: 'from-pink-500 to-pink-600' },
  ]

  const chartData = [
    { name: 'Students', count: stats.students },
    { name: 'Teachers', count: stats.teachers },
    { name: 'Subjects', count: stats.subjects },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 shadow-lg`}>
              <card.icon size={28} className="mb-3 opacity-80" />
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-sm opacity-80 mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  )
}