"use client"

import { JobCard } from "./JobCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { JobMatch } from "@/lib/match"

interface ResultsListProps {
  matches: JobMatch[]
  loading?: boolean
}

export function ResultsList({ matches, loading }: ResultsListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No job matches found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {matches.map((match, index) => (
        <JobCard key={match.job.id} jobMatch={match} index={index} />
      ))}
    </div>
  )
}

