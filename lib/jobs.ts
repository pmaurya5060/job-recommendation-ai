import jobsData from "@/data/jobs.json"

export type Job = typeof jobsData[number]

export const jobs = jobsData as Job[]

