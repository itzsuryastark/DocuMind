import { FileText, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  content: string
  role: "user" | "assistant"
  isLoading?: boolean
}

export function ChatMessage({ content, role, isLoading = false }: ChatMessageProps) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex items-start gap-3 max-w-[80%] rounded-lg p-4",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {role === "assistant" && (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <FileText className="h-4 w-4" />
          </div>
        )}
        <div className="whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            content
          )}
        </div>
        {role === "user" && (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  )
}

