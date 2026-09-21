import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const ADMIN_COOKIE = "aasoo-admin";

/** Timing-safe-ish compare; admin password is low stakes (single seller). */
export function verifyPassword(candidate: string): boolean {
  return candidate === env.ADMIN_PASSWORD;
}

export async function setAdminSession() {
  (await cookies()).set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function isAdminAuthed(): Promise<boolean> {
  return (await cookies()).get(ADMIN_COOKIE)?.value === "1";
}
