from app import db
from models.user import User

def get_user_by_id(user_id):
    """Get a user by ID"""
    return User.query.get(user_id)

def get_user_by_username(username):
    """Get a user by username"""
    return User.query.filter_by(username=username).first()

def get_user_by_email(email):
    """Get a user by email"""
    return User.query.filter_by(email=email).first()

def create_user(username, email, password):
    """Create a new user"""
    user = User(username=username, email=email)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return user