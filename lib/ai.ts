"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

type AIProvider = "groq" | "openai" | "gemini"

function getProvider(): AIProvider {
  if (process.env.GROQ_API_KEY) return "groq"
  if (process.env.OPENAI_API_KEY) return "openai"
  if (process.env.GOOGLE_API_KEY) return "gemini"
  return "groq" // Default to Groq
}

interface ChatCompletionChoice {
  message?: {
    content?: string
  }
}

interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[]
}

const SYSTEM_MESSAGE =
  "You are a helpful AI assistant that provides structured, JSON-formatted responses when requested."

async function createChatCompletion({
  apiKey,
  baseUrl,
  model,
  prompt,
}: {
  apiKey: string
  baseUrl: string
  model: string
  prompt: string
}): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`API request failed (${response.status}): ${errorBody}`)
  }

  const completion = (await response.json()) as ChatCompletionResponse
  return completion.choices?.[0]?.message?.content?.trim() ?? ""
}

async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("GROQ_API_KEY not found")

  return createChatCompletion({
    apiKey,
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    prompt,
  })
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OPENAI_API_KEY not found")

  return createChatCompletion({
    apiKey,
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    prompt,
  })
}

async function callGemini(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

export async function callAI(prompt: string): Promise<string> {
  const provider = getProvider()

  try {
    switch (provider) {
      case "groq":
        return await callGroq(prompt)
      case "openai":
        return await callOpenAI(prompt)
      case "gemini":
        if (!process.env.GOOGLE_API_KEY) {
          throw new Error("GOOGLE_API_KEY not found")
        }
        return await callGemini(prompt)
      default:
        throw new Error("No AI provider configured")
    }
  } catch (error) {
    console.error("AI API Error:", error)
    throw new Error(`Failed to call AI: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export interface ExtractedKeywords {
  skills: string[]
  techStack: string[]
  experienceLevel: string
  roles: string[]
  summary: string
  keywords: string[]
}

export async function extractKeywords(resumeText: string): Promise<ExtractedKeywords> {
  const prompt = `Analyze the following resume text and extract structured information. Return ONLY valid JSON, no markdown, no code blocks.

Resume text:
${resumeText.substring(0, 4000)}

Extract and return a JSON object with this exact structure:
{
  "skills": ["skill1", "skill2", ...],
  "techStack": ["tech1", "tech2", ...],
  "experienceLevel": "Junior/Mid/Senior/Lead",
  "roles": ["role1", "role2", ...],
  "summary": "Brief 2-3 sentence summary of the candidate's experience",
  "keywords": ["keyword1", "keyword2", ...]
}

Focus on technical skills, programming languages, frameworks, tools, and technologies.`

  const response = await callAI(prompt)

  try {
    // Clean response - remove markdown code blocks if present
    let cleaned = response.trim()
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```\n?/g, "")
    }

    const parsed = JSON.parse(cleaned) as ExtractedKeywords

    // Ensure all fields exist
    return {
      skills: parsed.skills || [],
      techStack: parsed.techStack || [],
      experienceLevel: parsed.experienceLevel || "Mid",
      roles: parsed.roles || [],
      summary: parsed.summary || "",
      keywords: parsed.keywords || [],
    }
  } catch (error) {
    console.error("Failed to parse AI response:", error)
    console.error("Response was:", response)
    
    // Fallback extraction
    return {
      skills: [],
      techStack: [],
      experienceLevel: "Mid",
      roles: [],
      summary: "Unable to parse resume. Please try again.",
      keywords: [],
    }
  }
}

