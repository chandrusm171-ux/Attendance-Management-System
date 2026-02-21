import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGO_URI)
await User.deleteMany({}) // clears existing users
await User.create({ username: 'admin', password: 'admin123', role: 'admin' })
console.log('Admin created: admin / admin123')
process.exit()