"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { extractTextFromFile } from "@/lib/parser"
import { extractKeywords } from "@/lib/ai"
import { matchJobs } from "@/lib/match"
import { useRouter } from "next/navigation"

export function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.type === "application/msword"
      ) {
        setFile(selectedFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
  })

  const handleProcess = async () => {
    if (!file) return

    setProcessing(true)
    setProgress(0)

    try {
      setProgress(20)
      const text = await extractTextFromFile(file)
      setProgress(40)

      setProgress(60)
      const keywords = await extractKeywords(text)
      setProgress(80)

      setProgress(90)
      const matches = await matchJobs(keywords)
      setProgress(100)

      // Store results in sessionStorage
      sessionStorage.setItem(
        "jobMatches",
        JSON.stringify({ matches, keywords })
      )

      router.push("/results")
    } catch (error) {
      console.error("Error processing resume:", error)
      toast({
        title: "Error processing resume",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      setProcessing(false)
      setProgress(0)
    }
  }

  const handleSampleResume = async () => {
    setProcessing(true)
    setProgress(0)

    try {
      // Create a sample resume text
      const sampleResume = `
John Doe
Senior Full-Stack Developer

EXPERIENCE
Senior Software Engineer | TechCorp | 2020 - Present
- Built scalable web applications using React, TypeScript, and Node.js
- Led a team of 5 developers in building microservices architecture
- Implemented CI/CD pipelines using GitHub Actions and Docker
- Optimized database queries reducing response time by 40%

Full-Stack Developer | StartupXYZ | 2018 - 2020
- Developed RESTful APIs using Express.js and PostgreSQL
- Built responsive frontend components with React and Tailwind CSS
- Integrated third-party services and payment processing

SKILLS
Frontend: React, TypeScript, Next.js, Tailwind CSS, Redux
Backend: Node.js, Express, PostgreSQL, MongoDB, REST APIs
DevOps: Docker, Kubernetes, AWS, CI/CD, GitHub Actions
Tools: Git, VS Code, Postman, Jest, Webpack

EDUCATION
Bachelor of Science in Computer Science | State University | 2018
      `

      setProgress(40)
      const keywords = await extractKeywords(sampleResume)
      setProgress(60)

      setProgress(80)
      const matches = await matchJobs(keywords)
      setProgress(100)

      sessionStorage.setItem(
        "jobMatches",
        JSON.stringify({ matches, keywords })
      )

      router.push("/results")
    } catch (error) {
      console.error("Error processing sample resume:", error)
      toast({
        title: "Error processing sample resume",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`cursor-pointer text-center space-y-4 ${
              isDragActive ? "opacity-70" : ""
            }`}
          >
            <input {...getInputProps()} />
            {!file ? (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {isDragActive
                      ? "Drop your resume here"
                      : "Drag & drop your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF or DOCX up to 4MB
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {file && (
        <div className="space-y-4">
          <Button
            onClick={handleProcess}
            disabled={processing}
            className="w-full"
            size="lg"
            variant="gradient"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Analyze Resume & Find Jobs"
            )}
          </Button>
          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {progress < 40
                  ? "Extracting text from resume..."
                  : progress < 60
                  ? "Analyzing skills and experience..."
                  : progress < 90
                  ? "Matching with job opportunities..."
                  : "Finalizing results..."}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        onClick={handleSampleResume}
        disabled={processing}
        variant="outline"
        className="w-full"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Try with Sample Resume"
        )}
      </Button>
    </div>
  )
}

