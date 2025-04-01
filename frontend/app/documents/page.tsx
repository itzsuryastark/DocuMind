"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Upload, Search, MoreVertical, Download, Trash2, Edit, Clock, File, FilePlus2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Document = {
  id: string
  name: string
  type: string
  size: string
  lastModified: string
  status: "draft" | "final" | "archived"
  tags: string[]
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Project Proposal",
      type: "docx",
      size: "245 KB",
      lastModified: "2 hours ago",
      status: "draft",
      tags: ["proposal", "project"],
    },
    {
      id: "2",
      name: "Technical Specification",
      type: "pdf",
      size: "1.2 MB",
      lastModified: "Yesterday",
      status: "final",
      tags: ["technical", "specification"],
    },
    {
      id: "3",
      name: "Meeting Notes",
      type: "txt",
      size: "32 KB",
      lastModified: "3 days ago",
      status: "archived",
      tags: ["meeting", "notes"],
    },
    {
      id: "4",
      name: "Product Roadmap",
      type: "pdf",
      size: "890 KB",
      lastModified: "1 week ago",
      status: "final",
      tags: ["product", "roadmap"],
    },
    {
      id: "5",
      name: "User Research",
      type: "docx",
      size: "1.5 MB",
      lastModified: "2 weeks ago",
      status: "draft",
      tags: ["research", "user"],
    },
  ])
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  const router = useRouter()

  const filteredDocuments = documents.filter((doc) => {
    // Filter by search query
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "drafts" && doc.status === "draft") ||
      (activeTab === "final" && doc.status === "final") ||
      (activeTab === "archived" && doc.status === "archived")

    return matchesSearch && matchesTab
  })

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
    toast({
      title: "Document deleted",
      description: "The document has been successfully deleted.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "final":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "archived":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
    }
  }

  return (
    <div className="flex flex-col h-screen">
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
            <Button variant="ghost" onClick={() => router.push("/chat")}>
              Chat
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Manage and organize your documents</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/chat")}>
              <FilePlus2 className="h-4 w-4 mr-2" />
              Generate Document
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Document Type</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="txt">TXT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date Modified</label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="cursor-pointer">
                      proposal
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      technical
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      meeting
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      product
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      research
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Quick Access</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Clock className="h-4 w-4 mr-2" /> Recent Documents
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <File className="h-4 w-4 mr-2" /> My Documents
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" /> Trash
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-3">
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="name">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date Modified</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="final">Final</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-0">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Size</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Modified</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.length > 0 ? (
                          filteredDocuments.map((doc) => (
                            <tr
                              key={doc.id}
                              className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                              onClick={() => router.push(`/documents/${doc.id}`)}
                            >
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                  <span>{doc.name}</span>
                                </div>
                              </td>
                              <td className="p-4 align-middle">{doc.type.toUpperCase()}</td>
                              <td className="p-4 align-middle">{doc.size}</td>
                              <td className="p-4 align-middle">{doc.lastModified}</td>
                              <td className="p-4 align-middle">
                                <Badge className={getStatusColor(doc.status)} variant="outline">
                                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/documents/${doc.id}`)
                                      }}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/documents/${doc.id}/edit`)
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteDocument(doc.id)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="h-24 text-center">
                              No documents found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

