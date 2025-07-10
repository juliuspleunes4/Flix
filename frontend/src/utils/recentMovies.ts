// Utility functions for managing recently watched movies in localStorage

export interface RecentMovie {
  id: string;
  title: string;
  thumbnail?: string;
  stars?: number;
  size?: number;
  watchedAt: string; // ISO timestamp
}

const RECENT_MOVIES_KEY = 'flix_recent_movies';
const MAX_RECENT_MOVIES = 5;

export const addRecentMovie = (movie: {
  id: string;
  title: string;
  thumbnail?: string;
  stars?: number;
  size?: number;
}): void => {
  try {
    const recentMovies = getRecentMovies();
    
    // Create new recent movie entry
    const newRecentMovie: RecentMovie = {
      ...movie,
      watchedAt: new Date().toISOString()
    };
    
    // Remove the movie if it already exists (to avoid duplicates)
    const filteredMovies = recentMovies.filter(m => m.id !== movie.id);
    
    // Add the new movie at the beginning
    const updatedMovies = [newRecentMovie, ...filteredMovies];
    
    // Keep only the most recent 5 movies
    const limitedMovies = updatedMovies.slice(0, MAX_RECENT_MOVIES);
    
    // Save to localStorage
    localStorage.setItem(RECENT_MOVIES_KEY, JSON.stringify(limitedMovies));
    
    console.log(`📺 Added to recent movies: ${movie.title}`);
  } catch (error) {
    console.error('Failed to add recent movie:', error);
  }
};

export const getRecentMovies = (): RecentMovie[] => {
  try {
    const stored = localStorage.getItem(RECENT_MOVIES_KEY);
    if (!stored) return [];
    
    const movies = JSON.parse(stored) as RecentMovie[];
    
    // Ensure we have valid data and sort by watchedAt (newest first)
    return movies
      .filter(movie => movie && movie.id && movie.title && movie.watchedAt)
      .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
      .slice(0, MAX_RECENT_MOVIES);
  } catch (error) {
    console.error('Failed to get recent movies:', error);
    return [];
  }
};

export const clearRecentMovies = (): void => {
  try {
    localStorage.removeItem(RECENT_MOVIES_KEY);
    console.log('🗑️ Cleared recent movies');
  } catch (error) {
    console.error('Failed to clear recent movies:', error);
  }
};

export const getRecentMovieIds = (): string[] => {
  return getRecentMovies().map(movie => movie.id);
};
