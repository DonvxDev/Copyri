import { NextRequest, NextResponse } from "next/server";
import { searchFiles, initDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "all";

    await initDB();
    const files = await searchFiles(query, category);

    return NextResponse.json({ files });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Suche fehlgeschlagen." }, { status: 500 });
  }
}
