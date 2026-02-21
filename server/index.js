import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Debug — shows every request body
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body)
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/attendance', attendanceRoutes)
app.get('/api/health', (_, res) => res.json({ status: 'OK' }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('✅ Server on port 5000'))
    console.log('✅ MongoDB connected')
  })
  .catch(err => console.error('❌', err.message))