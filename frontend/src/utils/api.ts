const API_BASE_URL = 'http://localhost:3001';

export interface Movie {
  id: number;
  title: string;
  filename: string;
  url: string;
  thumbnail?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getMovies(): Promise<Movie[]> {
    return this.request<Movie[]>('/api/movies');
  }

  async getMovie(id: number): Promise<Movie> {
    return this.request<Movie>(`/api/movies/${id}`);
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request('/api/health');
  }
}

export const apiClient = new ApiClient();
