import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  email: String,
  department: String,
  qualification: String,
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  timetable: [{ day: String, time: String, subject: String, class: String, room: String }],
}, { timestamps: true })

export default mongoose.model('Teacher', teacherSchema)