"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Trash2Icon, PlusIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Achievement } from "@/types/resume"

interface AchievementsFormProps {
  achievements: Achievement[]
  updateAchievements: (achievements: Achievement[]) => void
}

export function AchievementsForm({ achievements, updateAchievements }: AchievementsFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempAchievements, setTempAchievements] = useState<{title: string, description: string}[]>([])

  // Reset form when editing ID changes
  useEffect(() => {
    if (editingId) {
      const achievement = achievements.find((a) => a.id === editingId)
      if (achievement) {
        setTitle(achievement.title)
        setDescription(achievement.description || "")
      }
    } else {
      resetForm()
    }
  }, [editingId, achievements])

  const handleSaveAchievement = () => {
    if (!title.trim()) {
      alert("Please enter an achievement title")
      return
    }

    const achievementData: Achievement = {
      id: editingId || uuidv4(),
      title,
      description,
    }

    if (editingId) {
      // Update existing achievement
      updateAchievements(
        achievements.map((achievement) => (achievement.id === editingId ? achievementData : achievement)),
      )
    } else {
      // Add new achievement
      updateAchievements([...achievements, achievementData])
    }

    resetForm()
    setEditingId(null)
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
  }

  const handleEditAchievement = (id: string) => {
    setEditingId(id)
  }

  const handleRemoveAchievement = (id: string) => {
    updateAchievements(achievements.filter((achievement) => achievement.id !== id))
  }

  const handleCancelEdit = () => {
    resetForm()
    setEditingId(null)
  }

  const handleAddTempAchievement = () => {
    if (!title.trim()) return;
    
    setTempAchievements([...tempAchievements, {
      title: title.trim(),
      description: description.trim()
    }]);
    
    setTitle("");
    setDescription("");
  }

  const handleRemoveTempAchievement = (index: number) => {
    setTempAchievements(tempAchievements.filter((_, i) => i !== index));
  }

  const handleSaveAllAchievements = () => {
    if (tempAchievements.length === 0) return;
    
    const newAchievements = tempAchievements.map(achievement => ({
      id: uuidv4(),
      title: achievement.title,
      description: achievement.description
    }));
    
    updateAchievements([...achievements, ...newAchievements]);
    setTempAchievements([]);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">{editingId ? "Edit Achievement" : "Add Achievement"}</h3>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Achievement Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Participated in AI International Hackathon"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your achievement in detail"
            rows={3}
          />
        </div>

        <div className="flex gap-2 mt-4">
          {editingId ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveAchievement} className="flex-1">
                Update Achievement
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSaveAchievement} className="flex-1">
                Save Achievement
              </Button>
              <Button onClick={handleAddTempAchievement} variant="outline">
                Add to List
              </Button>
            </>
          )}
        </div>

        {tempAchievements.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Achievements to Add:</h4>
              <Button onClick={handleSaveAllAchievements} size="sm" variant="secondary">
                Save All Achievements
              </Button>
            </div>
            <div className="space-y-2 p-2 border rounded-md bg-background">
              {tempAchievements.map((achievement, index) => (
                <div key={index} className="p-2 border rounded flex justify-between items-start">
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    {achievement.description && (
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveTempAchievement(index)}
                    className="h-8 w-8 mt-0"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {achievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Achievements ({achievements.length})</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to remove all achievements?")) {
                  updateAchievements([]);
                }
              }}
            >
              Clear All
            </Button>
          </div>
          {achievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{achievement.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditAchievement(achievement.id)}>
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
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveAchievement(achievement.id)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
