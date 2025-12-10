import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/app/lib/auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.headers.set("Set-Cookie", await clearTokenCookie());
  return res;
}
