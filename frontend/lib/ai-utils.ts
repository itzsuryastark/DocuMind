import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Function to analyze a document and extract key information
export async function analyzeDocument(content: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert document analyzer. Extract key information, summarize content, and identify main themes.",
      prompt: `Analyze the following document and provide:
      1. A brief summary (3-5 sentences)
      2. Key points (bullet points)
      3. Main themes or topics
      4. Any action items or next steps mentioned
      
      Document content:
      ${content.substring(0, 8000)}`,
    })

    return { success: true, analysis: text }
  } catch (error) {
    console.error("Error analyzing document:", error)
    return { success: false, error: "Failed to analyze document" }
  }
}

// Function to generate a document based on user requirements
export async function generateDocument(type: string, title: string, description: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert document creator. Generate professional, well-structured documents based on user requirements.",
      prompt: `Create a ${type} document with the title "${title}" based on the following description:
      
      ${description}
      
      Generate a complete, professional document with appropriate sections, formatting, and content.
      Format the response in Markdown.`,
    })

    return { success: true, document: text }
  } catch (error) {
    console.error("Error generating document:", error)
    return { success: false, error: "Failed to generate document" }
  }
}

// Function to summarize a document
export async function summarizeDocument(content: string, length: "short" | "medium" | "long" = "medium") {
  try {
    const lengthMap = {
      short: "2-3 sentences",
      medium: "1-2 paragraphs",
      long: "3-4 paragraphs",
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are an expert document summarizer. Create concise, accurate summaries that capture the key points.",
      prompt: `Summarize the following document in ${lengthMap[length]}. Focus on the main points and key takeaways.
      
      Document content:
      ${content.substring(0, 8000)}`,
    })

    return { success: true, summary: text }
  } catch (error) {
    console.error("Error summarizing document:", error)
    return { success: false, error: "Failed to summarize document" }
  }
}

// Function to extract specific information from a document
export async function extractInformation(content: string, query: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert at extracting specific information from documents. Provide accurate, relevant answers based on document content.",
      prompt: `Extract the following information from the document:
      
      Query: ${query}
      
      Document content:
      ${content.substring(0, 8000)}
      
      Provide a detailed answer based only on the information in the document. If the information is not present, state that clearly.`,
    })

    return { success: true, information: text }
  } catch (error) {
    console.error("Error extracting information:", error)
    return { success: false, error: "Failed to extract information" }
  }
}

