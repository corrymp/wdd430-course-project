"use server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { User, JWTPayload } from "@/types/auth";
import { sql } from "./data";

// Make sure JWT_SECRET exists
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");

const JWT_EXPIRES_IN = "7d";

//#region User Registration
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);

  // check for existing email
  const existing = await sql<User[]>`
    SELECT * FROM "user" WHERE email = ${email}
  `;
  if (existing.length) throw new Error("Email already registered");

  // use placeholder image id 42
  const placeholderImageId = 42;

  // insert user with pfp pointing to placeholder image
  const result = await sql<User[]>`
    INSERT INTO "user" (name, email, password_hash, role, join_date, pfp)
    VALUES (${name}, ${email}, ${hashedPassword}, 'user', NOW(), ${placeholderImageId})
    RETURNING *;
  `;

  return result[0];
}

//#endregion

//#region User Login
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const users = await sql<User[]>`
    SELECT * FROM "user" WHERE email = ${email}
  `;
  if (!users.length) throw new Error("Invalid credentials");

  const user = users[0];

  // Use password_hash for comparison
  const match = await bcrypt.compare(password, user.password_hash!);
  if (!match) throw new Error("Invalid credentials");

  // JWT signing
  const token = jwt.sign(
    { id: user.id, role: user.role } as JWTPayload,
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Remove password_hash before returning
  const { password_hash, ...safeUser } = user;

  return { user: safeUser as User, token };
}
//#endregion

//#region Cookie Handling
export async function setTokenCookie(token: string) {
  return serialize("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: true,
  });
}

export async function clearTokenCookie() {
  return serialize("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: true,
  });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET as string) as unknown as JWTPayload;
  } catch {
    return null;
  }
}
//#endregion
