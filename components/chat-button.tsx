"use client"

import { useState } from "react"
import { MessageSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatModal } from "@/components/chat-modal"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <MessageSquareIcon className="h-4 w-4" />
        <span>AI Assistant</span>
      </Button>
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
