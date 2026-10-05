import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Upper- or mixed-case versions of a page address (/Locations/Sydney) go straight to the lowercase address.
// The query string (gclid, utm_*) is kept so ad tracking survives.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // pages only: not Next's own files, pictures or the verification file
  matcher: ["/((?!_next/|images/|api/|.*\\.[a-z0-9]+$).*)"],
};
