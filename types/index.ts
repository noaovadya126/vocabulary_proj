// Core application types
export interface User {
  id: string;
  email: string;
  profile?: Profile;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  preferredLanguage: string;
  ageGroup: 'CHILD' | 'TEEN' | 'ADULT';
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  rtl: boolean;
}

export interface Map {
  id: string;
  languageId: string;
  name: string;
  svgPathUrl: string;
  orderIndex: number;
  stations: Station[];
}

export interface Station {
  id: string;
  mapId: string;
  name: string;
  description: string;
  orderIndex: number;
  isLockedByDefault: boolean;
  positionX: number;
  positionY: number;
  words: StationWord[];
  isUnlocked?: boolean;
}

export interface Word {
  id: string;
  languageId: string;
  lemma: string;
  phonetic: string;
  translationHe: string;
  translationEn: string;
  partOfSpeech: 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB' | 'PRONOUN' | 'PREPOSITION' | 'INTERJECTION';
  exampleNative: string;
  exampleTranslationHe: string;
  media: WordMedia[];
}

export interface StationWord {
  id: string;
  stationId: string;
  wordId: string;
  orderIndex: number;
  word: Word;
}

export interface MediaAsset {
  id: string;
  type: 'IMAGE' | 'AUDIO' | 'VIDEO';
  url: string;
  mime: string;
  durationMs?: number;
  width?: number;
  height?: number;
  alt: string;
  createdAt: Date;
}

export interface WordMedia {
  id: string;
  wordId: string;
  mediaId: string;
  role: 'IMAGE' | 'PRONUNCIATION' | 'USAGE_VIDEO';
  media: MediaAsset;
}

export interface UserWordProgress {
  id: string;
  userId: string;
  wordId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'LEARNED';
  lastSeenAt?: Date;
  correctStreak: number;
  totalAttempts: number;
  totalCorrect: number;
  updatedAt: Date;
}

export interface StationAttempt {
  id: string;
  userId: string;
  stationId: string;
  startedAt: Date;
  finishedAt?: Date;
  score: number;
  passed: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
  achievement: Achievement;
}

export interface Character {
  id: string;
  name: string;
  spriteIdleUrl: string;
  spriteWalkUrl: string;
}

export interface UserRunProgress {
  id: string;
  userId: string;
  mapId: string;
  currentStationId?: string;
  charactersPair: {
    lead: string;
    buddy: string;
  };
  lastPositionPx: {
    x: number;
    y: number;
  };
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  ageGroup: 'CHILD' | 'TEEN' | 'ADULT';
}

export interface WordProgressRequest {
  wordId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'LEARNED';
}

export interface QuizStartRequest {
  stationId: string;
}

export interface QuizAnswerRequest {
  attemptId: string;
  wordId: string;
  isCorrect: boolean;
}

export interface QuizFinishRequest {
  attemptId: string;
}

// Quiz types
export interface QuizQuestion {
  id: string;
  type: 'AUDIO_CHOICE' | 'IMAGE_WORD' | 'WORD_TRANSLATION';
  wordId: string;
  word: Word;
  options: string[];
  correctAnswer: string;
}

export interface QuizAttempt {
  id: string;
  stationId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, boolean>;
  score: number;
  isComplete: boolean;
}

// Game state types
export interface GameState {
  currentLanguage: Language | null;
  currentMap: Map | null;
  currentStation: Station | null;
  userProgress: UserRunProgress | null;
  unlockedStations: string[];
}

// UI Component props
export interface StationCardProps {
  word: Word & { progress?: UserWordProgress };
  onWordClick: (word: Word) => void;
  onMarkLearned: (wordId: string) => void;
}

export interface MapCanvasProps {
  map: Map;
  userProgress: UserRunProgress | null;
  onStationClick: (station: Station) => void;
}

export interface QuizPanelProps {
  station: Station;
  onQuizComplete: (score: number, passed: boolean) => void;
}

export interface WordModalProps {
  word: Word;
  isOpen: boolean;
  onClose: () => void;
  onMarkLearned: (wordId: string) => void;
}

// Theme and styling types
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Feature flag types
export interface FeatureFlags {
  enableAchievements: boolean;
  enableAnalytics: boolean;
  enableMultiLanguage: boolean;
  enableAdvancedQuiz: boolean;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp: Date;
}

export interface LearningEvent extends AnalyticsEvent {
  wordId: string;
  stationId: string;
  action: 'view' | 'learn' | 'quiz_attempt' | 'quiz_complete';
  score?: number;
  timeSpent?: number;
}
