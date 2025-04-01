import Link from "next/link"
import { ArrowRight, FileText, Upload, MessageSquare, PenTool } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DocuMind</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/documents" className="text-sm font-medium hover:underline">
              Documents
            </Link>
            <Link href="/chat" className="text-sm font-medium hover:underline">
              Chat
            </Link>
          </nav>
          <div className="ml-4">
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  AI-Powered Document Assistant
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Upload, analyze, and generate documents with the help of advanced AI. Get summaries, insights, and
                  create professional documentation in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link href="/chat">
                      Start Using DocuMind <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/documents">View Your Documents</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[350px] rounded-lg border bg-background p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg opacity-50" />
                <div className="relative h-full rounded-md border bg-background shadow-sm overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className="font-medium">DocuMind Chat</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        Hello! I'm DocuMind. I can help you analyze documents, generate summaries, or create new
                        documentation. What would you like to do today?
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm">U</span>
                      </div>
                      <div className="bg-primary p-3 rounded-lg text-sm text-primary-foreground">
                        I need to create a technical specification document for a new software feature.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        I'd be happy to help with that! Let's start by outlining the key sections you'll need...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Powerful AI tools to streamline your documentation workflow
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-2">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Document Analysis</CardTitle>
                  <CardDescription>Upload and analyze documents to extract key insights</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  Upload PDFs, Word documents, or text files and get AI-powered analysis, summaries, and key points
                  extraction.
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/upload">
                      Try It <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-2">
                    <PenTool className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Document Generation</CardTitle>
                  <CardDescription>Create professional documents with AI assistance</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  Generate reports, proposals, specifications, and other documents based on your requirements and
                  guidelines.
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/generate">
                      Try It <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI Chat Assistant</CardTitle>
                  <CardDescription>Get real-time help with your documentation needs</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  Chat with our AI assistant to get answers, suggestions, and guidance for all your documentation tasks.
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/chat">
                      Try It <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DocuMind. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

