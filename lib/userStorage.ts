import { getUserData } from './auth';
import { scheduleCloudSave } from './cloudSync';

export function getUserStorageKey(key: string): string {
  const user = getUserData();
  if (!user?.id) return key;
  return `${user.id}__${key}`;
}

export function getUserItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(getUserStorageKey(key));
}

export function setUserItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getUserStorageKey(key), value);
  scheduleCloudSave();
}

export function removeUserItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getUserStorageKey(key));
  scheduleCloudSave();
}
