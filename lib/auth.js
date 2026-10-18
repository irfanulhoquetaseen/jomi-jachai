import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'officer_session';

/**
 * Returns the expected session token derived from the officer passcode.
 */
export function getExpectedSessionToken() {
  const passcode = process.env.OFFICER_PASSCODE || '';
  if (!passcode) return '';
  return createHash('sha256')
    .update(`${passcode}:jomi-jachai-officer-session`, 'utf8')
    .digest('hex');
}

/**
 * Verifies if the officer session cookie is valid.
 */
export async function isOfficerAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const expected = getExpectedSessionToken();
    return Boolean(token && expected && token === expected);
  } catch {
    return false;
  }
}

/**
 * Sets the officer session cookie.
 */
export async function setOfficerSession() {
  const token = getExpectedSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Clears the officer session cookie on logout.
 */
export async function clearOfficerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
