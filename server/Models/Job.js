import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  requiredSkills: [String]
})

export default mongoose.model('Job', jobSchema)