import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
}, { timestamps: true })

export default mongoose.model('Attendance', attendanceSchema)