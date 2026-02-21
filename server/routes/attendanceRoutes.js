import express from 'express'
import Attendance from '../models/Attendance.js'
import Teacher from '../models/Teacher.js'
import Student from '../models/Student.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Mark attendance (teacher)
router.post('/', protect, authorize('teacher'), async (req, res) => {
  const records = req.body // array of { studentId, subjectId, date, status }
  const teacher = await Teacher.findOne({ userId: req.user._id })
  const created = await Promise.all(records.map(r =>
    Attendance.findOneAndUpdate(
      { studentId: r.studentId, subjectId: r.subjectId, date: r.date },
      { ...r, teacherId: teacher._id },
      { upsert: true, new: true }
    )
  ))
  res.json(created)
})

// Get attendance (admin: all, teacher: their subjects, student: own)
router.get('/', protect, async (req, res) => {
  const { subjectId, studentId, date } = req.query
  let filter = {}
  if (subjectId) filter.subjectId = subjectId
  if (studentId) filter.studentId = studentId
  if (date) filter.date = date

  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id })
    filter.studentId = student._id
  }
  if (req.user.role === 'teacher') {
    const teacher = await Teacher.findOne({ userId: req.user._id })
    filter.teacherId = teacher._id
  }

  const records = await Attendance.find(filter)
    .populate('studentId', 'fullName rollNumber')
    .populate('subjectId', 'subjectName')
  res.json(records)
})

router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(record)
})

export default router