import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Demo default is "balloons". Set ADMIN_PASSWORD in your environment for production.
  const expected = process.env.ADMIN_PASSWORD || "balloons";

  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
