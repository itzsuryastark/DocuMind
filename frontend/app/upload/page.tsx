"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { FileText, Upload, X, Check, Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [documentTitle, setDocumentTitle] = useState("")
  const [documentDescription, setDocumentDescription] = useState("")
  const [documentTags, setDocumentTags] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setDocumentTitle(selectedFile.name.split(".")[0])

    // Create preview for text files
    if (selectedFile.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string)
      }
      reader.readAsText(selectedFile)
    } else {
      setFilePreview(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]

      // Simulate file input change event
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(droppedFile)

      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files
        const event = new Event("change", { bubbles: true })
        fileInputRef.current.dispatchEvent(event)
      }
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress > 100) {
        progress = 100
        clearInterval(interval)

        // Simulate upload completion after progress reaches 100%
        setTimeout(() => {
          setIsUploading(false)
          setUploadComplete(true)
          toast({
            title: "Upload complete",
            description: "Your document has been uploaded successfully.",
          })
        }, 500)
      }
      setUploadProgress(progress)
    }, 300)
  }

  const handleReset = () => {
    setFile(null)
    setFilePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    setUploadComplete(false)
    setDocumentTitle("")
    setDocumentDescription("")
    setDocumentTags("")

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAnalyze = () => {
    router.push("/chat")
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
            <p className="text-muted-foreground mt-2">
              Upload a document to analyze, summarize, or extract information using AI.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Upload a document in PDF, DOC, DOCX, or TXT format (max 10MB).</CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload your document</h3>
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX, and TXT (max 10MB)</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleReset} disabled={isUploading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {filePreview && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">File Preview:</h3>
                      <div className="max-h-[200px] overflow-y-auto text-sm">
                        <pre className="whitespace-pre-wrap">
                          {filePreview.substring(0, 1000)}
                          {filePreview.length > 1000 ? "..." : ""}
                        </pre>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Document Title</Label>
                      <Input
                        id="title"
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                        placeholder="Enter document title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        value={documentDescription}
                        onChange={(e) => setDocumentDescription(e.target.value)}
                        placeholder="Enter a brief description of this document"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (optional)</Label>
                      <Input
                        id="tags"
                        value={documentTags}
                        onChange={(e) => setDocumentTags(e.target.value)}
                        placeholder="Enter tags separated by commas"
                      />
                      <p className="text-xs text-muted-foreground">Example: report, technical, project</p>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/documents")}>
                Cancel
              </Button>
              {!uploadComplete ? (
                <Button onClick={handleUpload} disabled={!file || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>Upload Document</>
                  )}
                </Button>
              ) : (
                <Button onClick={handleAnalyze}>
                  Analyze Document <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>

          {uploadComplete && (
            <div className="mt-6 p-4 border rounded-lg bg-green-50 text-green-700 flex items-center gap-2">
              <Check className="h-5 w-5" />
              <p>Document uploaded successfully! You can now analyze it or view it in your documents.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

