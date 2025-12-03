"use server"

// Job API integration for India
// Supports multiple sources: Adzuna, JSearch (RapidAPI), or custom scraping

export interface JobListing {
  id: string
  title: string
  company: string
  description: string
  requiredSkills: string[]
  salaryRange: string
  experience: string
  location: string
  type: string
  url?: string
  postedDate?: string
}

// Fetch jobs from Adzuna API (India)
export async function fetchJobsFromAdzuna(
  keywords: string[],
  location: string = "India"
): Promise<JobListing[]> {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  if (!appId || !appKey) {
    console.warn("Adzuna API credentials not found, using fallback")
    return []
  }

  try {
    const query = keywords.slice(0, 5).join(" ")
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&content-type=application/json`

    const response = await fetch(url)
    if (!response.ok) throw new Error("Adzuna API error")

    const data = await response.json()

    return data.results?.map((job: any, index: number) => ({
      id: `adzuna-${job.id || index}`,
      title: job.title || "Job Title",
      company: job.company?.display_name || "Company",
      description: job.description || "",
      requiredSkills: extractSkillsFromDescription(job.description || ""),
      salaryRange: formatSalary(job.salary_min, job.salary_max),
      experience: extractExperience(job.description || ""),
      location: job.location?.display_name || location,
      type: job.contract_type || "Full-time",
      url: job.redirect_url,
      postedDate: job.created,
    })) || []
  } catch (error) {
    console.error("Error fetching from Adzuna:", error)
    return []
  }
}

// Fetch jobs from JSearch API (OpenWeb Ninja) - India focused
export async function fetchJobsFromJSearch(
  keywords: string[],
  location: string = "India"
): Promise<JobListing[]> {
  const apiKey = process.env.JSEARCH_API_KEY

  if (!apiKey) {
    console.warn("JSearch API key not found, using fallback")
    return []
  }

  try {
    // Build query from keywords
    const query = keywords.length > 0 
      ? `${keywords.slice(0, 5).join(" ")} jobs`
      : "developer jobs"
    
    // OpenWeb Ninja JSearch API endpoint
    // Based on the dashboard, parameters should be: query, page, num_pages, country, language
    const url = `https://api.openwebninja.com/jsearch/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=in&language=en`
    
    console.log("JSearch API URL:", url)
    console.log("JSearch API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "NOT FOUND")
    console.log("Query keywords:", keywords)

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
        "Accept": "*/*",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("JSearch API error:", response.status, errorText)
      throw new Error(`JSearch API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("JSearch API response status:", response.status)
    console.log("JSearch API response keys:", Object.keys(data))
    console.log("JSearch API full response:", JSON.stringify(data, null, 2))

    // Check if data structure matches expected format
    // OpenWeb Ninja might return data in different structure
    let jobs: any[] = []
    
    if (Array.isArray(data)) {
      jobs = data
    } else if (data.data && Array.isArray(data.data)) {
      jobs = data.data
    } else if (data.jobs && Array.isArray(data.jobs)) {
      jobs = data.jobs
    } else if (data.results && Array.isArray(data.results)) {
      jobs = data.results
    } else if (data.job_results && Array.isArray(data.job_results)) {
      jobs = data.job_results
    }
    
    console.log(`Found ${jobs.length} jobs from JSearch API`)

    if (jobs.length === 0) {
      console.warn("No jobs found in response. Response structure:", {
        isArray: Array.isArray(data),
        keys: Object.keys(data),
        sample: JSON.stringify(data).substring(0, 500)
      })
      return []
    }

    return jobs.map((job: any, index: number) => {
      // Handle different possible field names
      const jobId = job.job_id || job.id || `jsearch-${index}`
      const jobTitle = job.job_title || job.title || "Job Title"
      const company = job.employer_name || job.company || job.employer || "Company"
      const description = job.job_description || job.description || job.job_highlights?.items?.join(" ") || ""
      const city = job.job_city || job.city || ""
      const state = job.job_state || job.state || ""
      const locationStr = city && state ? `${city}, ${state}` : city || state || location
      
      return {
        id: `jsearch-${jobId}`,
        title: jobTitle,
        company: company,
        description: description,
        requiredSkills: extractSkillsFromDescription(description),
        salaryRange: formatSalary(job.job_min_salary, job.job_max_salary, job.job_salary_currency),
        experience: extractExperience(description),
        location: locationStr,
        type: job.job_employment_type || job.employment_type || "Full-time",
        url: job.job_apply_link || job.apply_link || job.url,
        postedDate: job.job_posted_at_datetime_utc || job.posted_date,
      }
    })
  } catch (error) {
    console.error("Error fetching from JSearch:", error)
    return []
  }
}

// Main function to fetch jobs - tries multiple sources
export async function fetchRealJobs(
  keywords: string[],
  location: string = "India"
): Promise<JobListing[]> {
  const jobs: JobListing[] = []

  // Try JSearch first (better for India)
  const jsearchJobs = await fetchJobsFromJSearch(keywords, location)
  jobs.push(...jsearchJobs)

  // Try Adzuna as fallback
  if (jobs.length < 20) {
    const adzunaJobs = await fetchJobsFromAdzuna(keywords, location)
    jobs.push(...adzunaJobs)
  }

  // Remove duplicates
  const uniqueJobs = Array.from(
    new Map(jobs.map((job) => [job.id, job])).values()
  )

  return uniqueJobs.slice(0, 50) // Limit to 50 jobs
}

// Helper functions
function extractSkillsFromDescription(description: string): string[] {
  const commonSkills = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "AWS",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "Next.js",
    "Angular",
    "Vue.js",
    "Express",
    "Django",
    "Flask",
    "Spring Boot",
    "Git",
    "CI/CD",
  ]

  const desc = description.toLowerCase()
  return commonSkills.filter((skill) => desc.includes(skill.toLowerCase()))
}

function extractExperience(description: string): string {
  const expMatch = description.match(/(\d+)\+?\s*years?/i)
  if (expMatch) {
    return `${expMatch[1]}+ years`
  }
  return "2+ years" // Default
}

function formatSalary(
  min?: number,
  max?: number,
  currency: string = "INR"
): string {
  if (!min && !max) return "Not disclosed"

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(Math.round(num))
  }

  if (currency === "USD") {
    // Convert USD to INR (1 USD = 83 INR)
    min = min ? min * 83 : undefined
    max = max ? max * 83 : undefined
  }

  if (min && max) {
    return `₹${formatNumber(min)} - ₹${formatNumber(max)}`
  } else if (min) {
    return `₹${formatNumber(min)}+`
  } else if (max) {
    return `Up to ₹${formatNumber(max)}`
  }

  return "Not disclosed"
}

