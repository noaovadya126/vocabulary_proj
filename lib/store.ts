import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  User, 
  Language, 
  Map, 
  Station, 
  UserRunProgress, 
  Word, 
  UserWordProgress,
  QuizAttempt,
  Theme,
  FeatureFlags
} from '@/types';

interface GameStore {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Game state
  currentLanguage: Language | null;
  currentMap: Map | null;
  currentStation: Station | null;
  userProgress: UserRunProgress | null;
  unlockedStations: string[];
  
  // Quiz state
  currentQuiz: QuizAttempt | null;
  isQuizActive: boolean;
  
  // UI state
  theme: Theme;
  isLoading: boolean;
  error: string | null;
  
  // Feature flags
  features: FeatureFlags;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  setCurrentLanguage: (language: Language) => void;
  setCurrentMap: (map: Map) => void;
  setCurrentStation: (station: Station | null) => void;
  setUserProgress: (progress: UserRunProgress | null) => void;
  unlockStation: (stationId: string) => void;
  setCurrentQuiz: (quiz: QuizAttempt | null) => void;
  setQuizActive: (active: boolean) => void;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateWordProgress: (wordId: string, status: UserWordProgress['status']) => void;
  resetGame: () => void;
}

const defaultTheme: Theme = {
  mode: 'light',
  primaryColor: '#2563eb',
  accentColor: '#10b981',
  backgroundColor: '#f8fafc',
  textColor: '#1e293b',
};

const defaultFeatures: FeatureFlags = {
  enableAchievements: true,
  enableAnalytics: true,
  enableMultiLanguage: false,
  enableAdvancedQuiz: false,
};

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
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
        theme: defaultTheme,
        isLoading: false,
        error: null,
        features: defaultFeatures,
        
        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        setAuthenticated: (status) => set({ isAuthenticated: status }),
        
        setCurrentLanguage: (language) => set({ currentLanguage: language }),
        
        setCurrentMap: (map) => set({ currentMap: map }),
        
        setCurrentStation: (station) => set({ currentStation: station }),
        
        setUserProgress: (progress) => set({ userProgress: progress }),
        
        unlockStation: (stationId) => {
          const { unlockedStations } = get();
          if (!unlockedStations.includes(stationId)) {
            set({ 
              unlockedStations: [...unlockedStations, stationId] 
            });
          }
        },
        
        setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
        
        setQuizActive: (active) => set({ isQuizActive: active }),
        
        setTheme: (theme) => set({ theme }),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error }),
        
        updateWordProgress: (wordId, status) => {
          const { userProgress } = get();
          if (userProgress) {
            // This would typically update the database
            // For now, we'll just update the local state
            set({ 
              userProgress: {
                ...userProgress,
                updatedAt: new Date(),
              }
            });
          }
        },
        
        resetGame: () => set({
          currentLanguage: null,
          currentMap: null,
          currentStation: null,
          userProgress: null,
          unlockedStations: [],
          currentQuiz: null,
          isQuizActive: false,
          error: null,
        }),
      }),
      {
        name: 'vocab-quest-store',
        partialize: (state) => ({
          user: state.user,
          theme: state.theme,
          features: state.features,
        }),
      }
    ),
    {
      name: 'vocab-quest-store',
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useGameStore((state) => state.user);
export const useIsAuthenticated = () => useGameStore((state) => state.isAuthenticated);
export const useCurrentLanguage = () => useGameStore((state) => state.currentLanguage);
export const useCurrentMap = () => useGameStore((state) => state.currentMap);
export const useCurrentStation = () => useGameStore((state) => state.currentStation);
export const useUserProgress = () => useGameStore((state) => state.userProgress);
export const useUnlockedStations = () => useGameStore((state) => state.unlockedStations);
export const useCurrentQuiz = () => useGameStore((state) => state.currentQuiz);
export const useIsQuizActive = () => useGameStore((state) => state.isQuizActive);
export const useTheme = () => useGameStore((state) => state.theme);
export const useIsLoading = () => useGameStore((state) => state.isLoading);
export const useError = () => useGameStore((state) => state.error);
export const useFeatures = () => useGameStore((state) => state.features);

// Action hooks
export const useGameActions = () => useGameStore((state) => ({
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated,
  setCurrentLanguage: state.setCurrentLanguage,
  setCurrentMap: state.setCurrentMap,
  setCurrentStation: state.setCurrentStation,
  setUserProgress: state.setUserProgress,
  unlockStation: state.unlockStation,
  setCurrentQuiz: state.setCurrentQuiz,
  setQuizActive: state.setQuizActive,
  setTheme: state.setTheme,
  setLoading: state.setLoading,
  setError: state.setError,
  updateWordProgress: state.updateWordProgress,
  resetGame: state.resetGame,
}));
