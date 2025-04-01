from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.document import Document
from services.ai_service import generate_document_content

generate_bp = Blueprint('generate', __name__)

@generate_bp.route('', methods=['POST'])
@jwt_required()
def generate_document():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('type') or not data.get('description'):
        return jsonify({'error': 'Missing required fields: title, type, or description'}), 400
    
    try:
        # Generate document content
        content = generate_document_content(
            document_type=data['type'],
            title=data['title'],
            description=data['description']
        )
        
        # Create document in database
        document = Document(
            title=data['title'],
            content=content,
            file_type='md',  # Markdown format
            status='draft',
            user_id=current_user_id
        )
        
        if 'tags' in data:
            document.set_tags(data['tags'])
        
        db.session.add(document)
        db.session.commit()
        
        return jsonify({
            'document': document.to_dict(),
            'content': content
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error generating document: {str(e)}")
        return jsonify({'error': 'Failed to generate document'}), 500