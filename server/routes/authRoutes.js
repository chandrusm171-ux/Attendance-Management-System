import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Create uploads folder if missing
const uploadsDir = 'uploads'
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })

// ── Create User (Admin only) ──────────────────────
router.post('/create-user', protect, authorize('admin'), upload.single('profileImage'), async (req, res) => {
  try {
    console.log('Create user - body:', req.body)
    console.log('Create user - file:', req.file)

    const username = req.body.username
    const password = req.body.password
    const role = req.body.role

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password and role are required' })
    }

    const exists = await User.findOne({ username: username.trim() })
    if (exists) return res.status(400).json({ message: 'Username already taken' })

    const user = await User.create({
      username: username.trim(),
      password: password,
      role: role.toLowerCase(),
      profileImage: req.file ? `/uploads/${req.file.filename}` : ''
    })

    res.status(201).json({ message: 'User created successfully', userId: user._id })
  } catch (err) {
    console.error('❌ Create user error:', err.message)
    console.error(err.stack)
    res.status(500).json({ message: err.message })
  }
})

// ── Login ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const normalizedUsername = username.trim()
    const normalizedRole = role.toLowerCase()

    console.log(`Login → username: "${normalizedUsername}", role: "${normalizedRole}"`)

    const user = await User.findOne({ username: normalizedUsername, role: normalizedRole })
    console.log('User found:', user ? 'YES' : 'NO')

    if (!user) return res.status(401).json({ message: 'User not found' })

    const passwordMatch = await user.matchPassword(password)
    console.log('Password match:', passwordMatch ? 'YES' : 'NO')

    if (!passwordMatch) return res.status(401).json({ message: 'Incorrect password' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      role: user.role,
      userId: user._id,
      username: user.username,
      profileImage: user.profileImage
    })
  } catch (err) {
    console.error('❌ Login error:', err.message)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// ── Get All Users ─────────────────────────────────
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

// ── Delete User ───────────────────────────────────
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' })
  }
})

// ── Update Profile Image ──────────────────────────
router.put('/profile-image', protect, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' })
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password')
    res.json({ message: 'Updated', profileImage: updated.profileImage })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile image' })
  }
})

// Admin uploads photo for any user
router.put('/users/:id/profile-image', protect, authorize('admin'), upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' })
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password')
    res.json({ message: 'Photo updated', profileImage: updated.profileImage })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Admin updates username/password for any user
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { username, password } = req.body
    const updateData = {}

    if (username) updateData.username = username.trim()

    if (password) {
      // Hash new password manually before saving
      const bcrypt = await import('bcryptjs')
      updateData.password = await bcrypt.default.hash(password, 10)
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password')

    res.json({ message: 'User updated', user: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── Get Current User ──────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

export default router