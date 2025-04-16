"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Trash2Icon, PlusIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import type { Skill } from "@/types/resume"

interface SkillsFormProps {
  skills: Skill[]
  updateSkills: (skills: Skill[]) => void
}

export function SkillsForm({ skills, updateSkills }: SkillsFormProps) {
  const [name, setName] = useState("")
  const [level, setLevel] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [bulkSkills, setBulkSkills] = useState("")
  const [tempSkills, setTempSkills] = useState<{name: string, level?: string}[]>([])

  // Reset form when editing ID changes
  useEffect(() => {
    if (editingId) {
      const skill = skills.find((s) => s.id === editingId)
      if (skill) {
        setName(skill.name)
        setLevel(skill.level || "")
      }
    } else {
      resetForm()
    }
  }, [editingId, skills])

  const handleSaveSkill = () => {
    if (!name.trim()) {
      alert("Please enter a skill name")
      return
    }

    const skillData: Skill = {
      id: editingId || uuidv4(),
      name,
      level: level || undefined,
    }

    if (editingId) {
      // Update existing skill
      updateSkills(skills.map((skill) => (skill.id === editingId ? skillData : skill)))
    } else {
      // Add new skill
      updateSkills([...skills, skillData])
    }

    resetForm()
    setEditingId(null)
  }

  const resetForm = () => {
    setName("")
    setLevel("")
  }

  const handleEditSkill = (id: string) => {
    setEditingId(id)
  }

  const handleRemoveSkill = (id: string) => {
    updateSkills(skills.filter((skill) => skill.id !== id))
  }

  const handleCancelEdit = () => {
    resetForm()
    setEditingId(null)
  }

  const handleAddTempSkill = () => {
    if (!name.trim()) return;
    
    setTempSkills([...tempSkills, {
      name: name.trim(),
      level: level || undefined
    }]);
    
    setName("");
    setLevel("");
  }

  const handleRemoveTempSkill = (index: number) => {
    setTempSkills(tempSkills.filter((_, i) => i !== index));
  }

  const handleSaveAllSkills = () => {
    if (tempSkills.length === 0) return;
    
    const newSkills = tempSkills.map(skill => ({
      id: uuidv4(),
      name: skill.name,
      level: skill.level
    }));
    
    updateSkills([...skills, ...newSkills]);
    setTempSkills([]);
  }

  const handleBulkAddSkills = () => {
    if (!bulkSkills.trim()) return;
    
    const skillNames = bulkSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const newSkills = skillNames.map(name => ({
      id: uuidv4(),
      name,
      level: undefined
    }));
    
    updateSkills([...skills, ...newSkills]);
    setBulkSkills("");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">{editingId ? "Edit Skill" : "Add Skills"}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Skill Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., JavaScript, Project Management, etc."
              required
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-1">
              Proficiency Level (Optional)
            </label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {editingId ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveSkill} className="flex-1">
                Update Skill
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSaveSkill} className="flex-1">
                Save Skill
              </Button>
              <Button onClick={handleAddTempSkill} variant="outline">
                Add to List
              </Button>
            </>
          )}
        </div>

        {tempSkills.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Skills to Add:</h4>
              <Button onClick={handleSaveAllSkills} size="sm" variant="secondary">
                Save All Skills
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
              {tempSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                  {skill.name} {skill.level && `(${skill.level})`}
                  <button 
                    onClick={() => handleRemoveTempSkill(index)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium mb-2">Bulk Add Skills</h4>
          <div className="space-y-2">
            <Textarea
              value={bulkSkills}
              onChange={(e) => setBulkSkills(e.target.value)}
              placeholder="Enter multiple skills separated by commas (e.g., JavaScript, React, Node.js)"
              rows={3}
            />
            <Button onClick={handleBulkAddSkills} className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Multiple Skills
            </Button>
          </div>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Skills ({skills.length})</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to remove all skills?")) {
                  updateSkills([]);
                }
              }}
            >
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    {skill.level && <p className="text-xs text-muted-foreground">{skill.level}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditSkill(skill.id)} className="h-8 w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-pencil"
                      >
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveSkill(skill.id)} className="h-8 w-8">
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
