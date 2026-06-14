import { getUserData } from './auth';

const SYNC_DEBOUNCE_MS = 2000;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let syncEnabled = false;

export function setCloudSyncEnabled(enabled: boolean): void {
  syncEnabled = enabled;
}

export function isCloudSyncEnabled(): boolean {
  return syncEnabled;
}

/** Collect all user-scoped local keys into a plain object for the API. */
export function collectLocalProgress(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const user = getUserData();
  if (!user?.id) return {};

  const prefix = `${user.id}__`;
  const out: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(prefix)) continue;
    const logical = key.slice(prefix.length);
    const value = localStorage.getItem(key);
    if (value != null) out[logical] = value;
  }

  const selectedLanguage = localStorage.getItem('selectedLanguage');
  if (selectedLanguage) out.__selectedLanguage = selectedLanguage;

  return out;
}

/** Merge server progress into local storage (server wins on conflict). */
export function applyCloudProgress(progress: Record<string, unknown>, selectedLanguage?: string | null): void {
  if (typeof window === 'undefined') return;
  const user = getUserData();
  if (!user?.id) return;

  for (const [key, value] of Object.entries(progress)) {
    if (key === '__selectedLanguage') continue;
    if (typeof value === 'string') {
      localStorage.setItem(`${user.id}__${key}`, value);
    } else {
      localStorage.setItem(`${user.id}__${key}`, JSON.stringify(value));
    }
  }

  if (selectedLanguage) {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }
}

export async function loadProgressFromCloud(): Promise<boolean> {
  try {
    const res = await fetch('/api/progress', { credentials: 'include' });
    if (!res.ok) return false;
    const data = (await res.json()) as {
      progress?: Record<string, unknown>;
      selectedLanguage?: string | null;
    };
    applyCloudProgress(data.progress ?? {}, data.selectedLanguage);
    setCloudSyncEnabled(true);
    return true;
  } catch {
    return false;
  }
}

export function scheduleCloudSave(): void {
  if (!syncEnabled || typeof window === 'undefined') return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void pushProgressToCloud();
  }, SYNC_DEBOUNCE_MS);
}

export async function pushProgressToCloud(): Promise<boolean> {
  if (!syncEnabled) return false;
  try {
    const progress = collectLocalProgress();
    const selectedLanguage = progress.__selectedLanguage ?? localStorage.getItem('selectedLanguage');
    delete progress.__selectedLanguage;

    const user = getUserData();
    const res = await fetch('/api/progress', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        progress,
        selectedLanguage,
        name: user?.name ?? null,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
