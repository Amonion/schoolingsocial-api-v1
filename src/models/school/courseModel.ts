import mongoose, { Schema } from 'mongoose'

export interface ICourse extends Document {
  schoolId: string
  facultyId: string
  levelName: string
  level: number
  semester: number
  courseCode: string
  load: number
  departmentId: number
  department: string
  name: string
  picture: string
  description: string
}

const CourseSchema: Schema = new Schema(
  {
    level: { type: Number },
    levelName: { type: String },
    semester: { type: Number },
    load: { type: Number },
    facultyId: { type: String },
    schoolId: { type: String },
    departmentId: { type: String },
    department: { type: String },
    name: { type: String, default: '' },
    courseCode: { type: String, default: '' },
    picture: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Course = mongoose.model<ICourse>('Course', CourseSchema)

export interface ISubject extends Document {
  schoolUsername: string
  levelName: string
  level: number
  term: number
  subjectCode: string
  curriculumTitle: string
  name: string
  picture: string
  description: string
}

const SubjectSchema: Schema = new Schema(
  {
    level: { type: Number },
    levelName: { type: String },
    term: { type: Number },
    schoolUsername: { type: String },
    curriculumTitle: { type: String },
    country: { type: String },
    state: { type: String },
    subjectCode: { type: String },
    name: { type: String },
    picture: { type: String },
    courseCode: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema)
