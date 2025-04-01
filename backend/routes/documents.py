from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename
from app import db
from models.document import Document
from models.user import User
from services.ai_service import analyze_document
from services.document_service import save_document_file, get_document_path

documents_bp = Blueprint('documents', __name__)

@documents_bp.route('', methods=['GET'])
@jwt_required()
def get_documents():
    current_user_id = get_jwt_identity()
    
    # Get query parameters
    status = request.args.get('status')
    search = request.args.get('search')
    
    # Base query
    query = Document.query.filter_by(user_id=current_user_id)
    
    # Apply filters
    if status:
        query = query.filter_by(status=status)
    
    if search:
        query = query.filter(Document.title.ilike(f'%{search}%'))
    
    # Execute query
    documents = query.order_by(Document.updated_at.desc()).all()
    
    return jsonify({
        'documents': [doc.to_dict() for doc in documents]
    }), 200

@documents_bp.route('/<int:document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    current_user_id = get_jwt_identity()
    
    document = Document.query.filter_by(id=document_id, user_id=current_user_id).first()
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    return jsonify({'document': document.to_dict()}), 200

@documents_bp.route('', methods=['POST'])
@jwt_required()
def create_document():
    current_user_id = get_jwt_identity()
    
    # Check if request has file or JSON data
    if 'file' in request.files:
        # Handle file upload
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Get form data
        title = request.form.get('title', file.filename)
        description = request.form.get('description', '')
        tags = request.form.get('tags', '').split(',') if request.form.get('tags') else []
        
        # Save file
        filename = secure_filename(file.filename)
        file_path = save_document_file(file, current_user_id)
        
        # Create document record
        document = Document(
            title=title,
            content=description,
            file_path=file_path,
            file_type=os.path.splitext(filename)[1][1:],  # Get extension without dot
            file_size=os.path.getsize(file_path),
            user_id=current_user_id
        )
        
        document.set_tags(tags)
        
        # Analyze document if requested
        if request.form.get('analyze') == 'true':
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
                analysis = analyze_document(content)
                document.analysis = analysis
            except Exception as e:
                current_app.logger.error(f"Error analyzing document: {str(e)}")
        
        db.session.add(document)
        db.session.commit()
        
        return jsonify({'document': document.to_dict()}), 201
    else:
        # Handle JSON data for document creation
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        document = Document(
            title=data['title'],
            content=data.get('content', ''),
            status=data.get('status', 'draft'),
            user_id=current_user_id
        )
        
        if 'tags' in data:
            document.set_tags(data['tags'])
        
        db.session.add(document)
        db.session.commit()
        
        return jsonify({'document': document.to_dict()}), 201

@documents_bp.route('/<int:document_id>', methods=['PUT'])
@jwt_required()
def update_document(document_id):
    current_user_id = get_jwt_identity()
    
    document = Document.query.filter_by(id=document_id, user_id=current_user_id).first()
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    data = request.get_json()
    
    if 'title' in data:
        document.title = data['title']
    
    if 'content' in data:
        document.content = data['content']
    
    if 'status' in data:
        document.status = data['status']
    
    if 'tags' in data:
        document.set_tags(data['tags'])
    
    db.session.commit()
    
    return jsonify({'document': document.to_dict()}), 200

@documents_bp.route('/<int:document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    current_user_id = get_jwt_identity()
    
    document = Document.query.filter_by(id=document_id, user_id=current_user_id).first()
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    # Delete file if exists
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    db.session.delete(document)
    db.session.commit()
    
    return jsonify({'message': 'Document deleted successfully'}), 200

@documents_bp.route('/<int:document_id>/download', methods=['GET'])
@jwt_required()
def download_document(document_id):
    current_user_id = get_jwt_identity()
    
    document = Document.query.filter_by(id=document_id, user_id=current_user_id).first()
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    if not document.file_path or not os.path.exists(document.file_path):
        return jsonify({'error': 'Document file not found'}), 404
    
    return send_file(document.file_path, as_attachment=True, download_name=f"{document.title}.{document.file_type}")

@documents_bp.route('/<int:document_id>/analyze', methods=['POST'])
@jwt_required()
def analyze_document_endpoint(document_id):
    current_user_id = get_jwt_identity()
    
    document = Document.query.filter_by(id=document_id, user_id=current_user_id).first()
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    try:
        content = ""
        if document.file_path and os.path.exists(document.file_path):
            with open(document.file_path, 'r') as f:
                content = f.read()
        elif document.content:
            content = document.content
        else:
            return jsonify({'error': 'No content to analyze'}), 400
        
        analysis = analyze_document(content)
        document.analysis = analysis
        db.session.commit()
        
        return jsonify({
            'analysis': analysis,
            'document': document.to_dict()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error analyzing document: {str(e)}")
        return jsonify({'error': 'Failed to analyze document'}), 500