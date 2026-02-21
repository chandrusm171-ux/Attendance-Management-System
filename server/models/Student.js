import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  rollNumber: String,
  degree: String,
  department: String,
  year: String,
  email: String,
  phone: String,
  fees: {
    amount: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    dueDate: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  timetable: [{ day: String, time: String, subject: String, room: String }],
  examDates: [{ subject: String, date: String, time: String, room: String }],
}, { timestamps: true })

export default mongoose.model('Student', studentSchema)