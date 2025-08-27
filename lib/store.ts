import { create } from 'zustand';

interface GameStore {
  // User state
  user: any | null;
  isAuthenticated: boolean;
  
  // Game state
  currentLanguage: any | null;
  currentMap: any | null;
  currentStation: any | null;
  userProgress: any | null;
  unlockedStations: string[];
  
  // Quiz state
  currentQuiz: any | null;
  isQuizActive: boolean;
  
  // UI state
  theme: 'light' | 'dark';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: any | null) => void;
  setAuthenticated: (status: boolean) => void;
  setCurrentLanguage: (language: any) => void;
  setCurrentMap: (map: any) => void;
  setCurrentStation: (station: any | null) => void;
  setUserProgress: (progress: any | null) => void;
  unlockStation: (stationId: string) => void;
  setCurrentQuiz: (quiz: any | null) => void;
  setQuizActive: (active: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateWordProgress: (wordId: string, status: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  currentLanguage: null,
  currentMap: null,
  currentStation: null,
  userProgress: null,
  unlockedStations: [],
  currentQuiz: null,
  isQuizActive: false,
  theme: 'light',
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setCurrentLanguage: (language) => set({ currentLanguage: language }),
  setCurrentMap: (map) => set({ currentMap: map }),
  setCurrentStation: (station) => set({ currentStation: station }),
  setUserProgress: (progress) => set({ userProgress: progress }),
  unlockStation: (stationId) => set((state) => ({
    unlockedStations: [...state.unlockedStations, stationId]
  })),
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setQuizActive: (active) => set({ isQuizActive: active }),
  setTheme: (theme) => set({ theme }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  updateWordProgress: (wordId, status) => set((state) => {
    if (state.userProgress) {
      return {
        userProgress: {
          ...state.userProgress,
          wordProgress: {
            ...state.userProgress.wordProgress,
            [wordId]: { status, updatedAt: new Date() }
          }
        }
      };
    }
    return state;
  }),
  resetGame: () => set({
    currentLanguage: null,
    currentMap: null,
    currentStation: null,
    userProgress: null,
    unlockedStations: [],
    currentQuiz: null,
    isQuizActive: false,
    error: null
  }),
}));
