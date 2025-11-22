import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DB_FILE || path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function readData() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { users: {}, refresh: {} };
  }
}

function writeData(data: any) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function getUserById(id: string) {
  const d = readData();
  return d.users[id] || null;
}

export function getUserByEmail(email: string) {
  const d = readData();
  for (const id of Object.keys(d.users || {})) {
    if (d.users[id].email === email) return d.users[id];
  }
  return null;
}

export function createUser(record: { id: string; email: string; passwordHash: string; name?: string; role?: string }) {
  const d = readData();
  d.users = d.users || {};
  d.users[record.id] = { 
    id: record.id, 
    email: record.email, 
    passwordHash: record.passwordHash, 
    name: record.name || null,
    role: record.role || 'user'
  };
  writeData(d);
  return d.users[record.id];
}

export function clearUsers() {
  const d = readData();
  d.users = {};
  writeData(d);
}

export function createRefreshToken(jti: string, userId: string) {
  const d = readData();
  d.refresh = d.refresh || {};
  d.refresh[jti] = userId;
  writeData(d);
}

export function getRefreshUserId(jti: string) {
  const d = readData();
  return (d.refresh && d.refresh[jti]) || null;
}

export function deleteRefresh(jti: string) {
  const d = readData();
  if (d.refresh && d.refresh[jti]) {
    delete d.refresh[jti];
    writeData(d);
  }
}

export function clearRefreshTokens() {
  const d = readData();
  d.refresh = {};
  writeData(d);
}

export function resetDatabase() {
  writeData({ users: {}, refresh: {} });
}

export { readData, writeData };

export default {
  readData,
  writeData,
};
