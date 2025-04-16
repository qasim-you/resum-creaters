"use client"

import { useState, useEffect } from "react"
import { CheckIcon } from "lucide-react"

export function SaveNotification() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Listen for storage events
    const handleStorage = () => {
      setVisible(true)
      setTimeout(() => setVisible(false), 2000)
    }

    window.addEventListener("storage", handleStorage)

    // Custom event for our own saves
    window.addEventListener("resume-saved", handleStorage as EventListener)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("resume-saved", handleStorage as EventListener)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-md shadow-md flex items-center gap-2 transition-opacity duration-300">
      <CheckIcon className="h-4 w-4" />
      <span>Changes saved</span>
    </div>
  )
}
