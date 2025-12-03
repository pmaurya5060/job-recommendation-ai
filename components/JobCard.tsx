"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Briefcase, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import type { JobMatch } from "@/lib/match"

interface JobCardProps {
  jobMatch: JobMatch
  index: number
}

export function JobCard({ jobMatch, index }: JobCardProps) {
  const { job, relevanceScore, matchReasons } = jobMatch

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
              <p className="text-sm font-medium text-muted-foreground">
                {job.company}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                {Math.round(relevanceScore)}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.slice(0, 5).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.requiredSkills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{job.requiredSkills.length - 5} more
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{job.salaryRange}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{job.experience}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">{job.type}</span>
            </div>
          </div>

          {matchReasons.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Why this match:
              </p>
              <ul className="space-y-1">
                {matchReasons.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start">
                    <span className="mr-2">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

