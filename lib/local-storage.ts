const STORAGE_KEY = "resume-data"

export function saveResumeData(data: any): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    
    // Dispatch a custom event to notify components
    const event = new Event("resume-saved")
    window.dispatchEvent(event)
  } catch (error) {
    console.error("Error saving resume data:", error)
  }
}

export function loadResumeData(): any {
  if (typeof window === "undefined") return null
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error loading resume data:", error)
    return null
  }
}

export function clearResumeData(): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing resume data:", error)
  }
}
