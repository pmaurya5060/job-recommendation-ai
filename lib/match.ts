"use server"

import { callAI } from "./ai"
import type { ExtractedKeywords } from "./ai"
import { jobs, type Job } from "./jobs"
import { fetchRealJobs, type JobListing } from "./job-api"

export interface JobMatch {
  job: Job
  relevanceScore: number
  matchReasons: string[]
}

export async function matchJobs(
  keywords: ExtractedKeywords
): Promise<JobMatch[]> {
  const allKeywords = [
    ...keywords.skills,
    ...keywords.techStack,
    ...keywords.roles,
    ...keywords.keywords,
  ].join(", ")

  const candidateProfile = `
Skills: ${keywords.skills.join(", ")}
Tech Stack: ${keywords.techStack.join(", ")}
Experience Level: ${keywords.experienceLevel}
Roles: ${keywords.roles.join(", ")}
Summary: ${keywords.summary}
`

  // Fetch real jobs from India
  let jobListings: Job[] = []
  
  console.log("Attempting to fetch real jobs with keywords:", [...keywords.skills, ...keywords.techStack])
  console.log("JSEARCH_API_KEY exists:", !!process.env.JSEARCH_API_KEY)
  
  try {
    const realJobs = await fetchRealJobs(
      [...keywords.skills, ...keywords.techStack],
      "India"
    )
    
    console.log(`Fetched ${realJobs.length} real jobs from API`)
    
    // Convert JobListing to Job format
    jobListings = realJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      requiredSkills: job.requiredSkills,
      salaryRange: job.salaryRange,
      experience: job.experience,
      location: job.location,
      type: job.type,
    }))
    
    console.log(`Converted ${jobListings.length} jobs to match format`)
  } catch (error) {
    console.error("Error fetching real jobs, using fallback:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
  }

  // Use real jobs if available, otherwise fallback to mock data
  const jobsToMatch = jobListings.length > 0 ? jobListings : jobs
  console.log(`Using ${jobsToMatch.length} jobs for matching (${jobListings.length > 0 ? 'REAL' : 'MOCK'})`)

  // Score each job using AI
  const scoredJobs: JobMatch[] = await Promise.all(
    jobsToMatch.map(async (job) => {
      const jobDescription = `
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required Skills: ${job.requiredSkills.join(", ")}
Experience: ${job.experience}
`

      const prompt = `You are a job matching expert. Rate how well this candidate matches the job on a scale of 0-100.

Candidate Profile:
${candidateProfile}

Job Description:
${jobDescription}

Return ONLY a JSON object with this exact structure:
{
  "score": 85,
  "reasons": ["reason1", "reason2", "reason3"]
}

The score should reflect:
- Skill overlap (40%)
- Experience level match (20%)
- Role alignment (20%)
- Tech stack compatibility (20%)

Return ONLY the JSON, no markdown, no explanation.`

      try {
        const response = await callAI(prompt)
        
        // Clean response
        let cleaned = response.trim()
        if (cleaned.startsWith("```json")) {
          cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "")
        } else if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/```\n?/g, "")
        }

        const parsed = JSON.parse(cleaned) as { score: number; reasons: string[] }

        return {
          job,
          relevanceScore: Math.min(100, Math.max(0, parsed.score || 0)),
          matchReasons: parsed.reasons || [],
        }
      } catch (error) {
        console.error(`Error scoring job ${job.id}:`, error)
        
        // Fallback: simple keyword matching
        const jobText = `${job.title} ${job.description} ${job.requiredSkills.join(" ")}`.toLowerCase()
        const keywordMatches = allKeywords
          .toLowerCase()
          .split(", ")
          .filter((kw) => jobText.includes(kw.trim())).length
        
        const totalKeywords = keywords.skills.length + keywords.techStack.length
        const fallbackScore = totalKeywords > 0 
          ? Math.min(100, (keywordMatches / totalKeywords) * 100)
          : 50 // Default score if no keywords

        return {
          job,
          relevanceScore: fallbackScore,
          matchReasons: ["Keyword-based match"],
        }
      }
    })
  )

  // Sort by relevance score (highest first)
  return scoredJobs.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

