import { NextResponse } from "next/server";
import { listRegistrations } from "@/lib/store";

export async function GET() {
  const registrations = await listRegistrations();
  return NextResponse.json({
    registrations: registrations.map((r) => r.name),
  });
}
