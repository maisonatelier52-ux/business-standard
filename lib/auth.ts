import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Subscriber {
  email: string;
  userId?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const SESSIONS_PATH = path.join(DATA_DIR, 'sessions.json');
const SUBSCRIBERS_PATH = path.join(DATA_DIR, 'subscribers.json');

// Ensure directory and JSON files exist
function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(SESSIONS_PATH)) {
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(SUBSCRIBERS_PATH)) {
    fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Simple fast hash for passwords (server side)
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + password.length;
}

export function getAllUsers(): User[] {
  ensureFiles();
  try {
    const content = fs.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(content || '[]');
  } catch {
    return [];
  }
}

export function getUserByEmailOrUsername(identifier: string): User | null {
  const users = getAllUsers();
  const clean = identifier.trim().toLowerCase();
  return users.find(u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean) || null;
}

export function registerUser(username: string, email: string, password: string): { user?: User; error?: string } {
  ensureFiles();
  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { error: 'Username must be at least 3 characters.' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 4) {
    return { error: 'Password must be at least 4 characters.' };
  }

  const users = getAllUsers();
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { error: 'An account with this email already exists.' };
  }
  if (users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
    return { error: 'This username is already taken.' };
  }

  const newUser: User = {
    id: 'u_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    username: cleanUsername,
    email: cleanEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
  return { user: newUser };
}

export function verifyUser(identifier: string, password: string): User | null {
  const user = getUserByEmailOrUsername(identifier);
  if (!user) return null;
  if (user.passwordHash === hashPassword(password)) {
    return user;
  }
  return null;
}

// ── Session Management ────────────────────────────────────────────────────────
export function getAllSessions(): Session[] {
  ensureFiles();
  try {
    const content = fs.readFileSync(SESSIONS_PATH, 'utf-8');
    return JSON.parse(content || '[]');
  } catch {
    return [];
  }
}

export async function createSession(user: User): Promise<string> {
  ensureFiles();
  const sessions = getAllSessions();
  const token = 'sess_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

  const newSession: Session = {
    token,
    userId: user.id,
    username: user.username,
    email: user.email,
    createdAt: new Date().toISOString()
  };

  sessions.push(newSession);
  fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2), 'utf-8');

  // Set HTTP-only Cookie
  const cookieStore = await cookies();
  cookieStore.set('bs_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  return token;
}

export async function getCurrentUser(): Promise<{ id: string; username: string; email: string; isSubscribed: boolean } | null> {
  ensureFiles();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bs_session')?.value;
    if (!token) return null;

    const sessions = getAllSessions();
    const session = sessions.find(s => s.token === token);
    if (!session) return null;

    const subscribed = isSubscribed(session.email);

    return {
      id: session.userId,
      username: session.username,
      email: session.email,
      isSubscribed: subscribed
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  ensureFiles();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bs_session')?.value;
    if (token) {
      const sessions = getAllSessions().filter(s => s.token !== token);
      fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
    }
    cookieStore.delete('bs_session');
  } catch (err) {
    console.error('Error destroying session:', err);
  }
}

// ── Subscriptions ─────────────────────────────────────────────────────────────
export function getAllSubscribers(): Subscriber[] {
  ensureFiles();
  try {
    const content = fs.readFileSync(SUBSCRIBERS_PATH, 'utf-8');
    return JSON.parse(content || '[]');
  } catch {
    return [];
  }
}

export function isSubscribed(email: string): boolean {
  const subscribers = getAllSubscribers();
  const cleanEmail = email.trim().toLowerCase();
  return subscribers.some(s => s.email.toLowerCase() === cleanEmail);
}

export function addSubscription(email: string, userId?: string): boolean {
  ensureFiles();
  const subscribers = getAllSubscribers();
  const cleanEmail = email.trim().toLowerCase();
  if (!subscribers.some(s => s.email.toLowerCase() === cleanEmail)) {
    subscribers.push({
      email: cleanEmail,
      userId,
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), 'utf-8');
  }
  return true;
}

export function removeSubscription(email: string): boolean {
  ensureFiles();
  const subscribers = getAllSubscribers();
  const cleanEmail = email.trim().toLowerCase();
  const filtered = subscribers.filter(s => s.email.toLowerCase() !== cleanEmail);
  fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
