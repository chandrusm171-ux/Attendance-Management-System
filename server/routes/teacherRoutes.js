import express from 'express'
import Teacher from '../models/Teacher.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorize('admin'), async (req, res) => {
  const teacher = await Teacher.create(req.body)
  res.status(201).json(teacher)
})

router.get('/', protect, authorize('admin'), async (req, res) => {
  const teachers = await Teacher.find().populate('userId', '-password').populate('subjects')
  res.json(teachers)
})

router.get('/me', protect, authorize('teacher'), async (req, res) => {
  const teacher = await Teacher.findOne({ userId: req.user._id }).populate('subjects')
  res.json(teacher)
})

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(teacher)
})

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

// Update timetable
router.put('/:id/timetable', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { timetable: req.body },
      { new: true }
    )
    res.json(teacher)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router