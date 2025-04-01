import os
import re
from datetime import datetime

def get_file_extension(filename):
    """Get the file extension from a filename"""
    return os.path.splitext(filename)[1][1:].lower()

def is_valid_email(email):
    """Check if an email is valid"""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def format_datetime(dt):
    """Format a datetime object as a string"""
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def get_time_ago(dt):
    """Get a human-readable string representing time ago"""
    now = datetime.utcnow()
    diff = now - dt
    
    seconds = diff.total_seconds()
    
    if seconds < 60:
        return "just now"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    elif seconds < 86400:
        hours = int(seconds / 3600)
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif seconds < 604800:
        days = int(seconds / 86400)
        return f"{days} day{'s' if days > 1 else ''} ago"
    elif seconds < 2592000:
        weeks = int(seconds / 604800)
        return f"{weeks} week{'s' if weeks > 1 else ''} ago"
    else:
        return dt.strftime('%Y-%m-%d')