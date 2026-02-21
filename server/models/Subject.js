import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
  subjectName: String,
  class: String,
  department: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
})

export default mongoose.model('Subject', subjectSchema)