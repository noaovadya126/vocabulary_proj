import type { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  WordProgressRequest,
  QuizStartRequest,
  QuizAnswerRequest,
  QuizFinishRequest,
  Language,
  Map,
  Station,
  User,
  UserRunProgress
} from '@/types';

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
  ): Promise<ApiResponse<T>> {
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
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
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

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
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

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>('/auth/logout', {
      method: 'POST',
    });

    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    return response;
  }

  // Languages
  async getLanguages(): Promise<ApiResponse<Language[]>> {
    return this.request<Language[]>('/languages');
  }

  // Maps
  async getMap(languageCode: string): Promise<ApiResponse<Map>> {
    return this.request<Map>(`/maps/${languageCode}`);
  }

  // Stations
  async getStation(stationId: string): Promise<ApiResponse<Station>> {
    return this.request<Station>(`/stations/${stationId}`);
  }

  // Progress
  async updateWordProgress(data: WordProgressRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/progress/word', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserProgress(): Promise<ApiResponse<UserRunProgress>> {
    return this.request<UserRunProgress>('/me/progress');
  }

  // Quiz
  async startQuiz(data: QuizStartRequest): Promise<ApiResponse<{ attemptId: string }>> {
    return this.request<{ attemptId: string }>('/quiz/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitQuizAnswer(data: QuizAnswerRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/quiz/answer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async finishQuiz(data: QuizFinishRequest): Promise<ApiResponse<{ 
    score: number; 
    passed: boolean; 
    nextStationId?: string 
  }>> {
    return this.request<{ 
      score: number; 
      passed: boolean; 
      nextStationId?: string 
    }>('/quiz/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Media
  getMediaUrl(path: string): string {
    // In production, this would return a signed CDN URL
    return `${this.baseUrl}/media${path}`;
  }

  // Utility methods
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getLanguages,
  getMap,
  getStation,
  updateWordProgress,
  getUserProgress,
  startQuiz,
  submitQuizAnswer,
  finishQuiz,
  getMediaUrl,
  setToken,
  getToken,
  isAuthenticated,
} = apiClient;

// Hook for using API client in components
export const useApi = () => apiClient;
