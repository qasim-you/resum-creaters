"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Education } from "@/types/resume"

interface EducationFormProps {
  education: Education[]
  updateEducation: (education: Education[]) => void
}

export function EducationForm({ education, updateEducation }: EducationFormProps) {
  const [degree, setDegree] = useState("")
  const [institution, setInstitution] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Reset form when editing ID changes
  useEffect(() => {
    if (editingId) {
      const edu = education.find(e => e.id === editingId)
      if (edu) {
        setDegree(edu.degree)
        setInstitution(edu.institution)
        setLocation(edu.location || "")
        setStartDate(edu.startDate)
        setEndDate(edu.endDate)
        setDescription(edu.description || "")
      }
    } else {
      resetForm()
    }
  }, [editingId, education])

  const handleSaveEducation = () => {
    if (!degree.trim() || !institution.trim() || !startDate || !endDate) {
      alert("Please fill in all required fields: Degree, Institution, Start Date, and End Date")
      return
    }

    const educationData: Education = {
      id: editingId || uuidv4(),
      degree,
      institution,
      location: location || undefined,
      startDate,
      endDate,
      description: description || undefined,
    }

    if (editingId) {
      // Update existing education
      updateEducation(
        education.map(edu => (edu.id === editingId ? educationData : edu))
      )
    } else {
      // Add new education
      updateEducation([...education, educationData])
    }

    resetForm()
    setEditingId(null)
  }

  const resetForm = () => {
    setDegree("")
    setInstitution("")
    setLocation("")
    setStartDate("")
    setEndDate("")
    setDescription("")
  }

  const handleEditEducation = (id: string) => {
    setEditingId(id)
  }

  const handleRemoveEducation = (id: string) => {
    updateEducation(education.filter((edu) => edu.id !== id))
  }

  const handleCancelEdit = () => {
    resetForm()
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Education" : "Add Education"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="degree" className="block text-sm font-medium mb-1">
              Degree / Certificate <span className="text-red-500">*</span>
            </label>
            <Input
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g., Bachelor of Science in Computer Science"
              required
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium mb-1">
              Institution <span className="text-red-500">*</span>
            </label>
            <Input
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g., University of Technology"
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
              placeholder="e.g., Boston, MA"
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
              End Date <span className="text-red-500">*</span>
            </label>
            <Input 
              id="endDate" 
              type="month" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description (Optional)
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your studies, achievements, etc."
            rows={3}
          />
        </div>

        <div className="flex gap-2 mt-4">
          {editingId && (
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSaveEducation} className="flex-1">
            {editingId ? "Update Education" : "Save Education"}
          </Button>
        </div>
      </div>

      {education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Education</h3>
          {education.map((edu) => (
            <Card key={edu.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{edu.degree}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution} {edu.location ? `• ${edu.location}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditEducation(edu.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEducation(edu.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {edu.description && (
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">{edu.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
