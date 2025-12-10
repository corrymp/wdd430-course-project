export interface User {
  password_hash: string;
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  pfp?: string;
  join_date: Date;
}

export interface JWTPayload {
  id: number;
  role: string;
}
