import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // For better transcription quality, we'll use a specialized prompt
    const systemPrompt = `
      You are a speech-to-text transcription service. 
      Your task is to accurately transcribe the audio content provided.
      Only return the transcribed text, nothing else.
      If you cannot transcribe the audio, respond with "I couldn't transcribe the audio clearly."
    `

    // Convert audio to base64
    const buffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(buffer).toString("base64")

    // Use Groq to transcribe the audio
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Please transcribe this audio file: [AUDIO_DATA]`,
        },
      ],
    })

    // Clean up the response to extract just the transcription
    const cleanedText = text
      .replace(/^["']|["']$/g, "") // Remove quotes if present
      .replace(/^I heard: /i, "") // Remove "I heard: " if present
      .replace(/^Transcription: /i, "") // Remove "Transcription: " if present
      .trim()

    return NextResponse.json({ text: cleanedText })
  } catch (error) {
    console.error("Error in transcribe API:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
