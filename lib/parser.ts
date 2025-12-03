"use server"

import pdfParse from "pdf-parse"
import mammoth from "mammoth"

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileType = file.type

  try {
    if (fileType === "application/pdf") {
      const data = await pdfParse(buffer)
      return data.text
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    } else {
      throw new Error("Unsupported file type. Please upload a PDF or DOCX file.")
    }
  } catch (error) {
    console.error("Error parsing file:", error)
    throw new Error(
      `Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

