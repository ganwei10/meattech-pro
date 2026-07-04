import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'meattech-pro-secret-key-change-in-prod32!'
);

export type CurrentUser = {
  userId: number;
  email: string;
  name: string;
  role: string;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('meattech_token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}
