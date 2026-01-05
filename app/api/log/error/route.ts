import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // In production, you would forward this to a logging system (Sentry, Datadog, etc.)
    // Keep logs minimal to avoid leaking sensitive data
    // eslint-disable-next-line no-console
    console.error("Client error report:", JSON.stringify(payload));

    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to log client error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
