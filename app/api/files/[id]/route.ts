import { NextRequest, NextResponse } from "next/server";
import { getFile, incrementDownload, initDB } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDB();
    const file = await getFile(params.id);

    if (!file) {
      return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ file });
  } catch (err) {
    console.error("Get file error:", err);
    return NextResponse.json({ error: "Fehler beim Laden." }, { status: 500 });
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDB();
    await incrementDownload(params.id);
    const file = await getFile(params.id);

    if (!file) {
      return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ blob_url: file.blob_url });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Fehler beim Download." }, { status: 500 });
  }
}
