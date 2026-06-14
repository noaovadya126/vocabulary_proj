import { UserData, setUserData } from './auth';

const ACCOUNTS_KEY = 'vq_accounts';

interface StoredAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ ok: true; user: UserData } | { ok: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();

  if (accounts.some((a) => a.email === normalizedEmail)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  const user: UserData = {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: name.trim() || normalizedEmail.split('@')[0],
    email: normalizedEmail,
  };

  accounts.push({
    id: user.id,
    email: normalizedEmail,
    name: user.name,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  });

  writeAccounts(accounts);
  setUserData(user);
  return { ok: true, user };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ ok: true; user: UserData } | { ok: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  const account = accounts.find((a) => a.email === normalizedEmail);

  if (!account) {
    return { ok: false, error: 'No account found with this email. Please sign up first.' };
  }

  const passwordHash = await hashPassword(password);
  if (account.passwordHash !== passwordHash) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }

  const user: UserData = {
    id: account.id,
    name: account.name,
    email: account.email,
  };

  setUserData(user);
  return { ok: true, user };
}
