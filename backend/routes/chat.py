from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ai_service import generate_chat_response

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('', methods=['POST', 'OPTIONS'])
def chat():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    
    if not data or 'messages' not in data:
        return jsonify({'error': 'Missing messages in request'}), 400
    
    try:
        # Log the incoming request for debugging
        current_app.logger.info(f"Chat request received with {len(data['messages'])} messages")
        
        response = generate_chat_response(data['messages'])
        return jsonify({'response': response}), 200
    except Exception as e:
        current_app.logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': f'Failed to generate response: {str(e)}'}), 500