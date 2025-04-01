from app import db
from datetime import datetime
import json

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(255), nullable=True)
    file_type = db.Column(db.String(50), nullable=True)
    file_size = db.Column(db.Integer, nullable=True)  # Size in bytes
    status = db.Column(db.String(20), default='draft')  # draft, final, archived
    tags = db.Column(db.Text, nullable=True)  # Stored as JSON string
    analysis = db.Column(db.Text, nullable=True)  # AI analysis results
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_tags(self, tags_list):
        self.tags = json.dumps(tags_list)
    
    def get_tags(self):
        if self.tags:
            return json.loads(self.tags)
        return []
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'status': self.status,
            'tags': self.get_tags(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id
        }