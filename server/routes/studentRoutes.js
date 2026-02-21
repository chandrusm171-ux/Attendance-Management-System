import express from 'express'
import Student from '../models/Student.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorize('admin'), async (req, res) => {
  const student = await Student.create(req.body)
  res.status(201).json(student)
})

router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  const students = await Student.find().populate('userId', '-password')
  res.json(students)
})

router.get('/me', protect, authorize('student'), async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id })
  res.json(student)
})

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(student)
})

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

// Update fees
router.put('/:id/fees', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { fees: req.body },
      { new: true }
    )
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update timetable
router.put('/:id/timetable', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { timetable: req.body },
      { new: true }
    )
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update exam dates
router.put('/:id/exams', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { examDates: req.body },
      { new: true }
    )
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router