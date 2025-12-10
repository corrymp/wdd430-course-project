import { NextRequest, NextResponse } from "next/server";
import { registerUser, loginUser, setTokenCookie } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body: { name?: string; email?: string; password?: string } =
      await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await registerUser(name, email, password);
    const { user, token } = await loginUser(email, password);

    const res = NextResponse.json(user);
    res.headers.set("Set-Cookie", await setTokenCookie(token));
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
