export interface PersonalInfo {
  name: string
  email: string
  phone: string
  github: string
  linkedin: string
}

export interface Achievement {
  id: string
  title: string
  description: string
}

export interface WorkExperience {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate: string
  current?: boolean
  description: string
  responsibilities: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location?: string
  startDate: string
  endDate: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  level?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  achievements: Achievement[]
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
}
