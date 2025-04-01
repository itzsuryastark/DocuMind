const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`Making request to: ${url}`);
  
  // Get token from localStorage if available
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token') || '';
  }
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    });
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        console.error('API error:', data);
        throw new Error(data.error || 'An error occurred');
      }
      
      return data;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  register: async (username: string, email: string, password: string) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },
  
  getUser: async () => {
    return fetchAPI('/auth/me');
  },
};

// Documents API
export const documentsAPI = {
  getDocuments: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    return fetchAPI(`/documents?${queryParams.toString()}`);
  },
  
  getDocument: async (id: string) => {
    return fetchAPI(`/documents/${id}`);
  },
  
  createDocument: async (data: any) => {
    return fetchAPI('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateDocument: async (id: string, data: any) => {
    return fetchAPI(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteDocument: async (id: string) => {
    return fetchAPI(`/documents/${id}`, {
      method: 'DELETE',
    });
  },
  
  analyzeDocument: async (id: string) => {
    return fetchAPI(`/documents/${id}/analyze`, {
      method: 'POST',
    });
  },
  
  uploadDocument: async (formData: FormData) => {
    const token = localStorage.getItem('auth_token') || '';
    
    try {
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (messages: any[]) => {
    console.log('Sending chat messages:', messages);
    return fetchAPI('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  },
};

// Generate API
export const generateAPI = {
  generateDocument: async (type: string, title: string, description: string) => {
    return fetchAPI('/generate', {
      method: 'POST',
      body: JSON.stringify({ type, title, description }),
    });
  },
};