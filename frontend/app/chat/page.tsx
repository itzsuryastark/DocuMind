"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Send, Upload, Loader2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { chatAPI } from "@/lib/api-client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm DocuMind, your AI document assistant. I can help you analyze documents, generate summaries, or create new documentation. What would you like to do today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending message to API:", [...messages, userMessage]);
      const response = await chatAPI.sendMessage([...messages, userMessage]);
      console.log("API response:", response);

      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);

      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis`,
      });
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const analyzeDocument = () => {
    if (!fileContent) {
      toast({
        title: "No file content",
        description: "Please upload a document first",
        variant: "destructive",
      });
      return;
    }

    setActiveTab("chat");

    // Add user message about the uploaded file
    const userMessage: Message = {
      role: "user",
      content: `I've uploaded a document called "${uploadedFile?.name}". Please analyze it for me.`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          `I've analyzed the document "${uploadedFile?.name}". Here's what I found:

` +
          "• Document Type: Technical Specification\n" +
          "• Length: Approximately 2,500 words\n" +
          "• Main Sections: Introduction, Requirements, Architecture, Implementation, Testing\n\n" +
          "Key points from the document:\n" +
          "1. The project aims to implement a new feature for document processing\n" +
          "2. Requirements include support for multiple file formats and AI-powered analysis\n" +
          "3. The architecture follows a microservices approach\n" +
          "4. Implementation is planned in three phases over 4 months\n\n" +
          "Would you like me to summarize any specific section in more detail?",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

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
            <Button variant="ghost" onClick={() => router.push("/documents")}>
              Documents
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container grid grid-cols-1 md:grid-cols-4 gap-6 p-4 md:p-6">
        <div className="md:col-span-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="upload">Upload Document</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="h-[calc(100vh-13rem)]">
              <Card className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[60px]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="upload" className="h-[calc(100vh-13rem)]">
              <Card className="h-full flex flex-col">
                <div className="flex-1 p-6 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                  />
                  {!uploadedFile ? (
                    <div className="text-center">
                      <div className="mx-auto bg-muted rounded-full h-24 w-24 flex items-center justify-center mb-4">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Upload a document
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Support for TXT, PDF, DOC, and DOCX files
                      </p>
                      <Button onClick={triggerFileInput}>Select File</Button>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <div className="mx-auto bg-primary/10 rounded-full h-24 w-24 flex items-center justify-center mb-4">
                        <FileText className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button onClick={analyzeDocument}>
                          Analyze Document
                        </Button>
                        <Button variant="outline" onClick={triggerFileInput}>
                          Change File
                        </Button>
                      </div>
                      {fileContent && (
                        <div className="mt-8 text-left">
                          <h4 className="text-md font-medium mb-2">
                            Document Preview:
                          </h4>
                          <div className="bg-muted p-4 rounded-md max-h-[300px] overflow-y-auto text-sm">
                            <pre className="whitespace-pre-wrap">
                              {fileContent.substring(0, 500)}...
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden md:block">
          <Card className="h-full">
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Recent Documents</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Project Proposal.docx</p>
                    <p className="text-xs text-muted-foreground">
                      Edited 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Technical Spec.pdf</p>
                    <p className="text-xs text-muted-foreground">
                      Edited yesterday
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Meeting Notes.txt</p>
                    <p className="text-xs text-muted-foreground">
                      Edited 3 days ago
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Document
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("chat")}
                >
                  <FileText className="h-4 w-4 mr-2" /> Create New Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" /> Export Chat
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
