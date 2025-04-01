"use client"

import { FileText, MoreVertical, Download, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocumentCardProps {
  id: string
  title: string
  type: string
  lastModified: string
  status: "draft" | "final" | "archived"
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onView?: (id: string) => void
}

export function DocumentCard({ id, title, type, lastModified, status, onDelete, onEdit, onView }: DocumentCardProps) {
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
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className={getStatusColor(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(id)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="font-medium text-lg mb-1 truncate">{title}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{type.toUpperCase()}</span>
            <span>Modified {lastModified}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t">
        <Button variant="ghost" className="w-full" onClick={() => onView && onView(id)}>
          Open Document
        </Button>
      </CardFooter>
    </Card>
  )
}

