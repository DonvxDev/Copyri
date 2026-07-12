import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { insertFile, initDB } from "@/lib/db";
import { generateId, MAX_FILE_SIZE } from "@/lib/utils";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const license = formData.get("license") as string;
    const copyrightYear = parseInt(formData.get("copyrightYear") as string);
    const tagsRaw = formData.get("tags") as string;
    const category = formData.get("category") as string;

    if (!file || !title || !author || !license || !category) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen: file, title, author, license, category" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Datei ist zu groß. Maximum: 5 GB" },
        { status: 413 }
      );
    }

    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const id = generateId();
    const ext = file.name.split(".").pop() ?? "";
    const blobName = `${id}${ext ? "." + ext : ""}`;

    const blob = await put(blobName, file, {
      access: "public",
      contentType: file.type,
    });

    await initDB();
    await insertFile({
      id,
      name: blobName,
      original_name: file.name,
      blob_url: blob.url,
      size: file.size,
      mime_type: file.type,
      title,
      description: description || null,
      author,
      license,
      copyright_year: copyrightYear || new Date().getFullYear(),
      tags,
      category,
    });

    return NextResponse.json({ id, url: `/file/${id}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen. Bitte erneut versuchen." },
      { status: 500 }
    );
  }
}
