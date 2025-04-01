import os
from flask import current_app
from werkzeug.utils import secure_filename
import uuid

def get_upload_folder():
    """Get the upload folder path, creating it if it doesn't exist"""
    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    return upload_folder

def get_user_folder(user_id):
    """Get the user's folder path, creating it if it doesn't exist"""
    user_folder = os.path.join(get_upload_folder(), str(user_id))
    
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)
    
    return user_folder

def save_document_file(file, user_id):
    """Save a document file to the user's folder"""
    user_folder = get_user_folder(user_id)
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(user_folder, unique_filename)
    
    # Save file
    file.save(file_path)
    
    return file_path

def get_document_path(document):
    """Get the full path to a document file"""
    if not document.file_path:
        return None
    
    return document.file_path