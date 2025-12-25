// app/api/auth/logout/route.ts
import { AUTH_TOKEN } from "@/constants/keys";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN);
  return NextResponse.json({ message: "Logged out successfully" });
}
