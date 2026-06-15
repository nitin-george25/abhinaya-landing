import { NextResponse, type NextRequest } from "next/server";
import { envForHost } from "@/lib/env";

// Diagnostic: stamp which Supabase env the host resolves to onto every response.
// Check with:  curl -sI https://<your-deployment>/ | grep -i x-abhinaya
//   x-abhinaya-env: staging   → *.workers.dev / previews (expected)
//   x-abhinaya-env: prod      → abhinayacinemas.com / www
export function middleware(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const res = NextResponse.next();
  res.headers.set("x-abhinaya-env", envForHost(host));
  res.headers.set("x-abhinaya-host", host || "(none)");
  return res;
}

export const config = {
  // Run on pages, skip Next internals and static assets.
  matcher: ["/((?!_next/|site/|favicon|.*\\.(?:png|jpg|jpeg|svg|ico|webmanifest|css|js|otf|woff2?)$).*)"],
};
