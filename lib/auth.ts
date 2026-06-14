export interface UserData {
  id: string;
  name: string;
  email: string;
}

export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('userData');
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<UserData>;
    if (!data?.id || !data?.email) return null;
    return {
      id: String(data.id),
      name: data.name ?? data.email.split('@')[0],
      email: data.email,
    };
  } catch {
    return null;
  }
}

export function setUserData(user: UserData): void {
  localStorage.setItem('userData', JSON.stringify(user));
}

export function clearUserData(): void {
  localStorage.removeItem('userData');
}

export function isAuthenticated(): boolean {
  return getUserData() !== null;
}
