import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Throw if the current request is not an authenticated admin. Use in every mutating server action. */
export async function assertAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}
