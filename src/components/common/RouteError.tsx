"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RouteErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
}

export default function RouteError({
  error,
  reset,
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again or return home.",
}: RouteErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[50vh] bg-background flex items-center justify-center px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto w-full flex justify-center">
        <Card className="w-full max-w-lg border-border">
          <CardHeader>
            <CardTitle className="font-heading text-xl md:text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button onClick={() => reset()}>Try again</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
