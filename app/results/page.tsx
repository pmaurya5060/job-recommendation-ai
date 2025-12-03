"use client";

import { useEffect, useState } from "react";
import { ResultsList } from "@/components/ResultsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import type { JobMatch } from "@/lib/match";
import type { ExtractedKeywords } from "@/lib/ai";

export default function ResultsPage() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [keywords, setKeywords] = useState<ExtractedKeywords | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("jobMatches");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setMatches(data.matches || []);
        setKeywords(data.keywords || null);
      } catch (error) {
        console.error("Error parsing stored data:", error);
        router.push("/upload");
      }
    } else {
      router.push("/upload");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <ResultsList matches={[]} loading={true} />
          </div>
        </div>
      </div>
    );
  }

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
              <Link href="/upload">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Upload Another
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Summary Card */}
          {keywords && (
            <Card className="border">
              <CardHeader>
                <CardTitle>Your Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Experience Level</p>
                  <Badge variant="secondary">{keywords.experienceLevel}</Badge>
                </div>
                {keywords.summary && (
                  <div>
                    <p className="text-sm font-medium mb-2">Summary</p>
                    <p className="text-sm text-muted-foreground">
                      {keywords.summary}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Skills & Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...keywords.skills, ...keywords.techStack]
                      .slice(0, 15)
                      .map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">
                Job Matches ({matches.length})
              </h2>
              <p className="text-muted-foreground">Sorted by relevance score</p>
            </div>
            <ResultsList matches={matches} />
          </div>
        </div>
      </div>
    </div>
  );
}
