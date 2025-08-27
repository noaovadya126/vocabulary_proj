
class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication
  async login(credentials: any): Promise<any> {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }
    }

    return response;
  }

  async register(userData: any): Promise<any> {
    const response = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }
    }

    return response;
  }

  async logout(): Promise<any> {
    const response = await this.request<void>('/auth/logout', {
      method: 'POST',
    });

    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    return response;
  }

  // Language and Map APIs
  async getLanguages(): Promise<any> {
    return this.request('/languages');
  }

  async getMap(languageId: string): Promise<any> {
    return this.request(`/maps/${languageId}`);
  }

  async getStation(stationId: string): Promise<any> {
    return this.request(`/stations/${stationId}`);
  }

  // Quiz APIs
  async startQuiz(stationId: string): Promise<any> {
    return this.request('/quiz/start', {
      method: 'POST',
      body: JSON.stringify({ stationId }),
    });
  }

  async submitQuizAnswer(quizId: string, questionId: string, answer: string): Promise<any> {
    return this.request('/quiz/answer', {
      method: 'POST',
      body: JSON.stringify({ quizId, questionId, answer }),
    });
  }

  async finishQuiz(quizId: string): Promise<any> {
    return this.request('/quiz/finish', {
      method: 'POST',
      body: JSON.stringify({ quizId }),
    });
  }

  // Progress APIs
  async updateWordProgress(wordId: string, status: string): Promise<any> {
    return this.request('/progress/word', {
      method: 'PUT',
      body: JSON.stringify({ wordId, status }),
    });
  }

  async getUserProgress(): Promise<any> {
    return this.request('/progress/user');
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
