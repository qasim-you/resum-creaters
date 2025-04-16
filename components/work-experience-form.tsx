"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WorkExperience } from "@/types/resume"

interface WorkExperienceFormProps {
  workExperience: WorkExperience[]
  updateWorkExperience: (workExperience: WorkExperience[]) => void
}

export function WorkExperienceForm({ workExperience, updateWorkExperience }: WorkExperienceFormProps) {
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [current, setCurrent] = useState(false)
  const [description, setDescription] = useState("")
  const [responsibility, setResponsibility] = useState("")
  const [responsibilities, setResponsibilities] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // Reset form when editing ID changes
  useEffect(() => {
    if (editingId) {
      const experience = workExperience.find(exp => exp.id === editingId)
      if (experience) {
        setTitle(experience.title)
        setCompany(experience.company)
        setLocation(experience.location || "")
        setStartDate(experience.startDate)
        setEndDate(experience.current ? "" : experience.endDate)
        setCurrent(experience.current || false)
        setDescription(experience.description)
        setResponsibilities(experience.responsibilities || [])
      }
    } else {
      resetForm()
    }
  }, [editingId, workExperience])

  const handleAddResponsibility = () => {
    if (!responsibility.trim()) return
    setResponsibilities([...responsibilities, responsibility])
    setResponsibility("")
  }

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index))
  }

  const handleSaveExperience = () => {
    if (!title.trim() || !company.trim() || !startDate) {
      alert("Please fill in all required fields: Job Title, Company, and Start Date")
      return
    }

    const experienceData: WorkExperience = {
      id: editingId || uuidv4(),
      title,
      company,
      location: location || undefined,
      startDate,
      endDate: current ? "Present" : endDate,
      current,
      description,
      responsibilities,
    }

    if (editingId) {
      // Update existing experience
      updateWorkExperience(
        workExperience.map(exp => (exp.id === editingId ? experienceData : exp))
      )
    } else {
      // Add new experience
      updateWorkExperience([...workExperience, experienceData])
    }

    resetForm()
    setEditingId(null)
  }

  const resetForm = () => {
    setTitle("")
    setCompany("")
    setLocation("")
    setStartDate("")
    setEndDate("")
    setCurrent(false)
    setDescription("")
    setResponsibilities([])
  }

  const handleEditExperience = (id: string) => {
    setEditingId(id)
  }

  const handleRemoveExperience = (id: string) => {
    updateWorkExperience(workExperience.filter((exp) => exp.id !== id))
  }

  const handleCancelEdit = () => {
    resetForm()
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Work Experience" : "Add Work Experience"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Software Engineer"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Acme Inc."
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location (Optional)
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <Input 
              id="startDate" 
              type="month" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End Date {!current && <span className="text-red-500">*</span>}
            </label>
            <Input
              id="endDate"
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={current}
              required={!current}
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox 
              id="current" 
              checked={current} 
              onCheckedChange={(checked) => setCurrent(checked as boolean)} 
            />
            <label
              htmlFor="current"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I currently work here
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Job Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your role and responsibilities"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="responsibility" className="block text-sm font-medium mb-1">
            Key Responsibilities
          </label>
          <div className="flex gap-2">
            <Input
              id="responsibility"
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              placeholder="Add a key responsibility"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddResponsibility()
                }
              }}
            />
            <Button type="button" onClick={handleAddResponsibility} size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {responsibilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Added Responsibilities:</h4>
            <ul className="space-y-2">
              {responsibilities.map((resp, index) => (
                <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span className="text-sm">{resp}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="h-6 w-6"
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {editingId && (
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSaveExperience} className="flex-1">
            {editingId ? "Update Experience" : "Save Experience"}
          </Button>
        </div>
      </div>

      {workExperience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Work Experience</h3>
          {workExperience.map((exp) => (
            <Card key={exp.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{exp.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} {exp.location ? `• ${exp.location}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditExperience(exp.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveExperience(exp.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm mb-2">{exp.description}</p>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {exp.responsibilities.map((resp, index) => (
                        <li key={index} className="text-sm">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
