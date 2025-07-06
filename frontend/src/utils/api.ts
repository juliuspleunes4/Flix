const API_BASE_URL = 'http://localhost:3000';

export interface Movie {
  id: number;
  title: string;
  filename: string;
  url: string;
  size?: number;
  modified?: string;
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

  async getStats(): Promise<{
    movieCount: number;
    totalSize: number;
    totalSizeFormatted: string;
    moviesDir: string;
    serverUptime: number;
    timestamp: string;
  }> {
    return this.request('/api/stats');
  }
}

// Helper function to format file sizes
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const apiClient = new ApiClient();
