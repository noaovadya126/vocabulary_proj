export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initAudio();
  }

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      this.audio = new Audio();
      this.setupEventListeners();
    }
    return this.audio;
  }

  private setupEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('play', () => this.emit('play'));
    this.audio.addEventListener('pause', () => this.emit('pause'));
    this.audio.addEventListener('ended', () => this.emit('ended'));
    this.audio.addEventListener('error', (e) => this.emit('error', e));
  }

  async play(url: string, options?: AudioPlayOptions): Promise<void> {
    const audio = this.initAudio();
    if (!audio) {
      throw new Error('Audio not available in this environment');
    }

    if (url.includes('#') || url.includes('.txt') || url.includes('.md')) {
      throw new Error('Invalid audio URL');
    }

    return new Promise((resolve, reject) => {
      const onEnded = () => {
        cleanup();
        options?.onEnd?.();
        resolve();
      };
      const onError = () => {
        cleanup();
        const err = new Error(`Failed to play audio: ${url}`);
        options?.onError?.(err);
        reject(err);
      };
      const cleanup = () => {
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
      };

      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);

      if (options?.volume !== undefined) {
        audio.volume = options.volume;
      }
      if (options?.playbackRate !== undefined) {
        audio.playbackRate = options.playbackRate;
      }

      if (this.currentUrl !== url) {
        audio.src = url;
        this.currentUrl = url;
        audio.load();
      }

      audio.play()
        .then(() => this.emit('play'))
        .catch(onError);
    });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.emit('stop');
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.emit('pause');
    }
  }

  resume(): void {
    if (this.audio) {
      this.audio.play();
      this.emit('play');
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.audio) {
      this.audio.playbackRate = Math.max(0.1, Math.min(4, rate));
    }
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused && !this.audio.ended : false;
  }

  // Event handling
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  once(event: string, callback: Function): void {
    const onceCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.eventListeners.clear();
  }
}

// Singleton instance
export const audioPlayer = new AudioPlayer();

// React hook for using the audio player
export const useAudioPlayer = () => {
  return audioPlayer;
};

// Utility functions
export const preloadAudio = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const audio = new Audio();
    audio.addEventListener('canplaythrough', () => resolve());
    audio.addEventListener('error', reject);
    audio.src = url;
  });
};

export const isAudioSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Audio' in window;
};

// Audio play options interface
export interface AudioPlayOptions {
  volume?: number;
  playbackRate?: number;
  onEnd?: () => void;
  onError?: (error: any) => void;
}
