import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const isInMaintenanceMode =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  const PUBLIC_FILE = /\.(.*)$/;

  if (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/static") ||
    req.nextUrl.pathname.includes(".") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  )
    return NextResponse.next();

  if (isInMaintenanceMode) {
    if (req.nextUrl.pathname !== "/maintenance") {
      return NextResponse.redirect(new URL("/maintenance", process.env.BASE_URL));
    }
  }
}
