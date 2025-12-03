"use client"

import { ResumeUploader } from "@/components/ResumeUploader"
import { ArrowLeft, Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="w-6 h-6" />
              <span className="text-xl font-semibold">Job AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">Upload Your Resume</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload your resume in PDF or DOCX format. We&apos;ll analyze it and
              match you with the best job opportunities.
            </p>
          </div>

          <ResumeUploader />
        </div>
      </div>
    </div>
  )
}

