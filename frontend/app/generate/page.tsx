"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, PenTool, Download, Copy, Check, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [documentType, setDocumentType] = useState("report")
  const [documentTitle, setDocumentTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = () => {
    if (!prompt.trim() || !documentTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your document.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate AI generation with a delay
    setTimeout(() => {
      let content = ""

      if (documentType === "report") {
        content = `# ${documentTitle}

## Executive Summary
This report provides a comprehensive analysis of the key findings related to ${prompt}. The analysis reveals significant insights that can inform strategic decision-making and operational improvements.

## Introduction
${prompt} represents an important area of focus for our organization. This report aims to provide a detailed examination of the current state, challenges, and opportunities in this domain.

## Methodology
Our analysis employed a mixed-methods approach, combining quantitative data analysis with qualitative insights gathered from stakeholder interviews and industry best practices.

## Key Findings
1. Finding One: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
2. Finding Two: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
3. Finding Three: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Analysis
The data indicates several important trends that merit attention. First, we observe a significant correlation between X and Y factors. Second, the comparative analysis reveals that our approach differs from industry standards in several key aspects.

## Recommendations
Based on our findings, we recommend the following actions:
1. Implement a structured approach to addressing the challenges identified in Finding One.
2. Develop a comprehensive strategy to leverage the opportunities outlined in Finding Two.
3. Allocate resources to further investigate the implications of Finding Three.

## Conclusion
This analysis of ${prompt} provides valuable insights that can guide our strategic direction. By implementing the recommendations outlined in this report, we can enhance our performance and achieve our organizational objectives.

## Appendices
- Appendix A: Detailed Methodology
- Appendix B: Data Tables
- Appendix C: Reference Materials`
      } else if (documentType === "proposal") {
        content = `# ${documentTitle}

## Executive Summary
This proposal outlines a comprehensive approach to addressing ${prompt}. It presents a structured solution that aligns with organizational objectives and delivers measurable value.

## Background
${prompt} represents a significant opportunity/challenge for our organization. This proposal aims to address this by providing a well-defined solution framework.

## Objectives
- To develop a comprehensive solution for ${prompt}
- To implement the solution within the specified timeframe and budget
- To achieve measurable outcomes that align with organizational goals

## Proposed Solution
Our proposed solution encompasses the following key components:

1. **Component One**: A structured approach to addressing the core challenges
2. **Component Two**: An innovative methodology that leverages existing resources
3. **Component Three**: A scalable framework that can adapt to changing requirements

## Implementation Plan
The implementation will follow a phased approach:

### Phase 1: Planning and Preparation (Weeks 1-2)
- Conduct detailed requirements analysis
- Develop project plan and resource allocation
- Establish key performance indicators

### Phase 2: Development and Testing (Weeks 3-6)
- Develop core solution components
- Conduct iterative testing and refinement
- Prepare documentation and training materials

### Phase 3: Deployment and Evaluation (Weeks 7-8)
- Deploy the solution in a controlled environment
- Monitor performance and gather feedback
- Make necessary adjustments based on initial results

## Budget and Resources
The estimated budget for this project is $XX,XXX, allocated as follows:
- Personnel: $XX,XXX
- Technology: $X,XXX
- Other expenses: $X,XXX

## Expected Outcomes
The successful implementation of this proposal will result in:
- Improved efficiency in handling ${prompt}
- Enhanced quality of outputs and deliverables
- Measurable cost savings and/or revenue generation

## Conclusion
This proposal presents a structured approach to addressing ${prompt}. By implementing this solution, we can achieve significant improvements in our operations and outcomes.`
      } else if (documentType === "specification") {
        content = `# ${documentTitle} - Technical Specification

## 1. Introduction
### 1.1 Purpose
This technical specification document outlines the detailed requirements and design for ${prompt}.

### 1.2 Scope
This specification covers the technical aspects, architecture, interfaces, and implementation details for ${prompt}.

### 1.3 Definitions and Acronyms
- Term 1: Definition
- Term 2: Definition
- Acronym 1: Expansion
- Acronym 2: Expansion

## 2. System Overview
### 2.1 System Description
${prompt} is designed to [brief description of the system's purpose and functionality].

### 2.2 System Context
[Description of how the system fits into the larger ecosystem or organization]

## 3. Functional Requirements
### 3.1 Core Functionality
- Requirement 1: [Description]
- Requirement 2: [Description]
- Requirement 3: [Description]

### 3.2 User Interfaces
- UI Requirement 1: [Description]
- UI Requirement 2: [Description]

### 3.3 System Interfaces
- Interface 1: [Description]
- Interface 2: [Description]

## 4. Non-Functional Requirements
### 4.1 Performance
- Performance Requirement 1: [Description]
- Performance Requirement 2: [Description]

### 4.2 Security
- Security Requirement 1: [Description]
- Security Requirement 2: [Description]

### 4.3 Reliability
- Reliability Requirement 1: [Description]
- Reliability Requirement 2: [Description]

## 5. System Architecture
### 5.1 Component Diagram
[Description of the system's components and their relationships]

### 5.2 Data Model
[Description of the data structures and relationships]

### 5.3 Interfaces
[Description of the interfaces between components]

## 6. Implementation Details
### 6.1 Technologies
- Technology 1: [Description and justification]
- Technology 2: [Description and justification]

### 6.2 Development Environment
[Description of the development environment and tools]

### 6.3 Deployment Architecture
[Description of the deployment architecture]

## 7. Testing Strategy
### 7.1 Test Approach
[Description of the overall testing approach]

### 7.2 Test Cases
- Test Case 1: [Description]
- Test Case 2: [Description]

## 8. Appendices
### 8.1 References
- Reference 1: [Description]
- Reference 2: [Description]

### 8.2 Supporting Documents
- Document 1: [Description]
- Document 2: [Description]`
      }

      setGeneratedContent(content)
      setIsGenerating(false)
    }, 3000)
  }

  const handleCopy = () => {
    if (!generatedContent) return

    navigator.clipboard.writeText(generatedContent)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "Document content copied to clipboard.",
    })

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleDownload = () => {
    if (!generatedContent) return

    // Create a blob with the content
    const blob = new Blob([generatedContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentTitle.replace(/\s+/g, "_")}.md`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded as a Markdown file.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DocuMind</span>
          </div>
          <nav className="ml-auto flex gap-4">
            <Button variant="ghost" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => router.push("/documents")}>
              Documents
            </Button>
            <Button variant="ghost" onClick={() => router.push("/chat")}>
              Chat
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Generate Document</h1>
            <p className="text-muted-foreground mt-2">
              Create professional documents with AI assistance. Describe what you need, and our AI will generate it for
              you.
            </p>
          </div>

          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedContent}>
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="generate">
              <Card>
                <CardHeader>
                  <CardTitle>Document Generator</CardTitle>
                  <CardDescription>Provide details about the document you want to create</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="document-type">Document Type</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger id="document-type">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="specification">Technical Specification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document-title">Document Title</Label>
                    <Input
                      id="document-title"
                      placeholder="Enter a title for your document"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document-prompt">Document Description</Label>
                    <Textarea
                      id="document-prompt"
                      placeholder="Describe what you want in your document. Be as specific as possible."
                      rows={6}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Example: "A project proposal for implementing a new customer relationship management system for a
                      mid-sized retail business."
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleGenerate} disabled={isGenerating} className="ml-auto">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <PenTool className="mr-2 h-4 w-4" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                  <CardDescription>Review your generated document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-md p-4 overflow-auto max-h-[60vh]">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{generatedContent}</pre>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setGeneratedContent(null)}>
                    Generate New
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

