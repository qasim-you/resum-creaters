import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";


// Define the expected message shape
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// System prompt for the AI resume assistant
const SYSTEM_PROMPT = `You are an AI resume assistant helping users create professional resumes.
Provide helpful advice on resume writing, formatting, and content.
Suggest improvements for different sections like work experience, skills, education, etc.
Keep responses concise and practical.`;

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' array is required" },
        { status: 400 }
      );
    }

    // Format messages with type safety
    const formattedMessages: Message[] = body.messages.map((msg: any) => {
      if (!msg.role || !msg.content) {
        throw new Error("Each message must have a 'role' and 'content'");
      }
      return {
        role: msg.role,
        content: msg.content,
      };
    });

    // Generate response using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192", {
        apiKey: process.env.GROQ_API_KEY!, // optional if set globally
      }),
      messages: formattedMessages,
      system: SYSTEM_PROMPT,
    });

    // 🔥 Remove markdown formatting (** and *)
    const cleanText = text.replace(/\*\*/g, "").replace(/\*/g, "");

    return NextResponse.json({ message: cleanText });

  } catch (error) {
    console.error("Error in chat API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process your request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
