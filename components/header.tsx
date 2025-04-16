"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ChatButton } from "@/components/chat-button"

export function Header() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Resume Builder</h1>
        <div className="flex items-center gap-4">
          <ChatButton />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}
