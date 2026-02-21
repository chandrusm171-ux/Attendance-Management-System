import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    required: true
  },
  profileImage: { type: String, default: '' },
}, { timestamps: true, collection: 'users' })

// ✅ Async pre-save — NO next() parameter needed in modern Mongoose
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = function (pwd) {
  return bcrypt.compare(pwd, this.password)
}

export default mongoose.model('User', userSchema)