"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { AchievementsForm } from "@/components/achievements-form"
import { WorkExperienceForm } from "@/components/work-experience-form"
import { EducationForm } from "@/components/education-form"
import { SkillsForm } from "@/components/skills-form"
import { ResumePreview } from "@/components/resume-preview"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { generatePDF } from "@/lib/generate-pdf"
import { saveResumeData, loadResumeData, clearResumeData } from "@/lib/local-storage"
import { SaveNotification } from "@/components/save-notification"
import { AlertTriangleIcon } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ResumeData } from "@/types/resume"

const initialResumeData: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
  },
  achievements: [],
  workExperience: [],
  education: [],
  skills: [],
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [activeTab, setActiveTab] = useState("edit")
  const [isLoaded, setIsLoaded] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = loadResumeData()
    if (savedData) {
      setResumeData(savedData)
    }
    setIsLoaded(true)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        saveResumeData(resumeData)
        setSaveError(null)
      } catch (error) {
        setSaveError("Failed to save your data. Please try again.")
        console.error("Error saving data:", error)
      }
    }
  }, [resumeData, isLoaded])

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleDownload = async () => {
    await generatePDF(resumeData)
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all resume data? This cannot be undone.")) {
      setResumeData(initialResumeData)
      clearResumeData()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-6 px-4 md:px-6 flex-1">
        {saveError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="edit">Edit Resume</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                Reset Data
              </Button>
              <Button
  onClick={handleDownload}
  className="text-base sm:text-sm px-6 sm:px-3 py-2 sm:py-1.5 h-10 sm:h-8"
>
  Download PDF
</Button>
            </div>
          </div>

          <TabsContent value="edit" className="space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full justify-start mb-6 overflow-x-auto">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="experience">Work Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalInfoForm
                  data={resumeData.personalInfo}
                  updateData={(data) => updateResumeData("personalInfo", data)}
                />
              </TabsContent>

              <TabsContent value="achievements">
                <AchievementsForm
                  achievements={resumeData.achievements}
                  updateAchievements={(data) => updateResumeData("achievements", data)}
                />
              </TabsContent>

              <TabsContent value="experience">
                <WorkExperienceForm
                  workExperience={resumeData.workExperience}
                  updateWorkExperience={(data) => updateResumeData("workExperience", data)}
                />
              </TabsContent>

              <TabsContent value="education">
                <EducationForm
                  education={resumeData.education}
                  updateEducation={(data) => updateResumeData("education", data)}
                />
              </TabsContent>

              <TabsContent value="skills">
                <SkillsForm skills={resumeData.skills} updateSkills={(data) => updateResumeData("skills", data)} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="preview">
            <ResumePreview data={resumeData} />
          </TabsContent>
        </Tabs>
      </div>
      <SaveNotification />
    </div>
  )
}
