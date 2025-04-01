import { type NextRequest, NextResponse } from "next/server"
import { generateDocument } from "@/lib/ai-utils"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { type, title, description } = await req.json()

    if (!type || !title || !description) {
      return NextResponse.json({ error: "Missing required fields: type, title, or description" }, { status: 400 })
    }

    // Generate document
    const result = await generateDocument(type, title, description)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      document: result.document,
      title,
      type,
    })
  } catch (error) {
    console.error("Error generating document:", error)
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 })
  }
}

