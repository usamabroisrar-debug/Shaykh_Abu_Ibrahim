import { NextResponse } from "next/server";
import { searchSiteContent } from "@/services/search/search.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const results = await searchSiteContent(query);

  return NextResponse.json(results);
}
