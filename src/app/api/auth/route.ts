import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || "bwsbabel123";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === CORRECT_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth", "authenticated", {
      httpOnly: false, // Allow client-side access for authentication check
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 jam
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
