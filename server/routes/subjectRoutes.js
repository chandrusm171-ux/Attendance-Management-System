import express from 'express'
import Subject from '../models/Subject.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('Create subject body:', req.body)
    
    const { subjectName, class: className, department, teacherId } = req.body

    if (!subjectName || !className || !department) {
      return res.status(400).json({ message: 'Subject name, class and department are required' })
    }

    const subject = await Subject.create({
      subjectName,
      class: className,
      department,
      teacherId: teacherId || null
    })

    res.status(201).json(subject)
  } catch (err) {
    console.error('Create subject error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

router.get('/', protect, async (req, res) => {
  try {
    const subjects = await Subject.find().populate('teacherId', 'fullName department')
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(subject)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router