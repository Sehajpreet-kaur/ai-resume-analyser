// models/Resume.js
import mongoose from 'mongoose'

const tipSchema = new mongoose.Schema({
  type: { type: String, enum: ['good', 'improve'] },
  tip: String,
  explanation: String
})

const feedbackCategorySchema = new mongoose.Schema({
  score: Number,
  tips: [tipSchema]
})

const feedbackSchema = new mongoose.Schema({
  overallScore: Number,
  ATS: feedbackCategorySchema,
  toneAndStyle: feedbackCategorySchema,
  content: feedbackCategorySchema,
  structure: feedbackCategorySchema,
  skills: feedbackCategorySchema
})

const resumeSchema = new mongoose.Schema({
    id:String,
  companyName: String,
  jobTitle: String,
  imagePath: String,
  resumePath: String,
  feedback: feedbackSchema
})

export default mongoose.model('Resume', resumeSchema)