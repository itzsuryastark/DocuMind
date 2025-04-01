import openai
from flask import current_app
import json

def get_openai_client():
    """Get OpenAI client with API key from config"""
    api_key = current_app.config['OPENAI_API_KEY']
    if not api_key:
        raise ValueError("OpenAI API key is not set")
    
    client = openai.OpenAI(api_key=api_key)
    return client

def generate_chat_response(messages):
    """Generate a response using OpenAI's chat completion API"""
    client = get_openai_client()
    
    # Prepare messages for OpenAI API
    formatted_messages = []
    
    # Add system message if not present
    if not any(msg.get('role') == 'system' for msg in messages):
        formatted_messages.append({
            "role": "system",
            "content": """You are DocuMind, an AI assistant specialized in document processing, analysis, and generation.
            
            Your capabilities include:
            1. Analyzing documents to extract key information, themes, and insights
            2. Summarizing documents of various types and lengths
            3. Generating professional documents based on user requirements
            4. Answering questions about document structure, formatting, and best practices
            5. Providing guidance on documentation standards and templates
            
            When responding to users:
            - Be helpful, professional, and concise
            - Provide specific, actionable advice
            - When generating or analyzing documents, follow industry best practices
            - If you don't know something, admit it rather than making up information
            - For document generation, ask clarifying questions if the user's requirements are vague
            
            Always maintain a helpful, professional tone."""
        })
    
    # Add user messages
    for message in messages:
        formatted_messages.append({
            "role": message.get('role'),
            "content": message.get('content')
        })
    
    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=formatted_messages,
        temperature=0.7,
        max_tokens=1000
    )
    
    return response.choices[0].message.content

def analyze_document(content):
    """Analyze document content and extract key information"""
    client = get_openai_client()
    
    # Truncate content if too long
    max_length = 8000
    if len(content) > max_length:
        content = content[:max_length] + "..."
    
    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are an expert document analyzer. Extract key information, summarize content, and identify main themes."
            },
            {
                "role": "user",
                "content": f"""Analyze the following document and provide:
                1. A brief summary (3-5 sentences)
                2. Key points (bullet points)
                3. Main themes or topics
                4. Any action items or next steps mentioned
                
                Document content:
                {content}"""
            }
        ],
        temperature=0.5,
        max_tokens=1000
    )
    
    return response.choices[0].message.content

def generate_document_content(document_type, title, description):
    """Generate document content based on type, title, and description"""
    client = get_openai_client()
    
    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are an expert document creator. Generate professional, well-structured documents based on user requirements."
            },
            {
                "role": "user",
                "content": f"""Create a {document_type} document with the title "{title}" based on the following description:
                
                {description}
                
                Generate a complete, professional document with appropriate sections, formatting, and content.
                Format the response in Markdown."""
            }
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    return response.choices[0].message.content