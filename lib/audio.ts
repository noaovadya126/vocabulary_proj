class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentSrc: string | null = null;

  constructor() {
    // Initialize audio element
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.isPlaying = false;
    });
  }

  async play(src: string, options: {
    volume?: number;
    playbackRate?: number;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  } = {}): Promise<void> {
    if (!this.audio) {
      throw new Error('Audio not supported in this environment');
    }

    try {
      // Stop current audio if playing
      if (this.isPlaying) {
        await this.stop();
      }

      // Set new source
      if (this.currentSrc !== src) {
        this.audio.src = src;
        this.currentSrc = src;
      }

      // Apply options
      if (options.volume !== undefined) {
        this.audio.volume = Math.max(0, Math.min(1, options.volume));
      }

      if (options.playbackRate !== undefined) {
        this.audio.playbackRate = Math.max(0.5, Math.min(2, options.playbackRate));
      }

      // Set up event handlers
      if (options.onEnd) {
        this.audio.addEventListener('ended', options.onEnd, { once: true });
      }

      if (options.onError) {
        this.audio.addEventListener('error', (e) => {
          options.onError!(new Error('Audio playback failed'));
        }, { once: true });
      }

      // Play audio
      await this.audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.audio || !this.isPlaying) return;

    try {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  }

  async pause(): Promise<void> {
    if (!this.audio || !this.isPlaying) return;

    try {
      this.audio.pause();
      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to pause audio:', error);
    }
  }

  async resume(): Promise<void> {
    if (!this.audio || this.isPlaying) return;

    try {
      await this.audio.play();
    } catch (error) {
      console.error('Failed to resume audio:', error);
    }
  }

  setVolume(volume: number): void {
    if (!this.audio) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = clampedVolume;
  }

  setPlaybackRate(rate: number): void {
    if (!this.audio) return;

    const clampedRate = Math.max(0.5, Math.min(2, rate));
    this.audio.playbackRate = clampedRate;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentSrc(): string | null {
    return this.currentSrc;
  }

  // Accessibility methods
  getAudioElement(): HTMLAudioElement | null {
    return this.audio;
  }

  // Cleanup
  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.isPlaying = false;
    this.currentSrc = null;
  }
}

// Create singleton instance
export const audioPlayer = new AudioPlayer();

// Hook for using audio player in components
export const useAudioPlayer = () => audioPlayer;

// Utility function to preload audio
export const preloadAudio = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => resolve(), { once: true });
    audio.addEventListener('error', () => reject(new Error('Failed to preload audio')), { once: true });
    audio.src = src;
  });
};

// Utility function to check audio support
export const isAudioSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const audio = document.createElement('audio');
  return !!(
    audio.canPlayType &&
    audio.canPlayType('audio/mpeg;').replace(/no/, '') &&
    audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '')
  );
};
