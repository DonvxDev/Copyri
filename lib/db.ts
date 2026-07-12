import { sql } from "@vercel/postgres";

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      blob_url TEXT NOT NULL,
      size BIGINT NOT NULL,
      mime_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      license TEXT NOT NULL,
      copyright_year INTEGER NOT NULL,
      tags TEXT DEFAULT '',
      category TEXT NOT NULL,
      download_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

export type FileRecord = {
  id: string;
  name: string;
  original_name: string;
  blob_url: string;
  size: number;
  mime_type: string;
  title: string;
  description: string | null;
  author: string;
  license: string;
  copyright_year: number;
  tags: string;
  category: string;
  download_count: number;
  created_at: string;
};

export function parseTags(tags: string): string[] {
  return tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
}

export async function insertFile(file: Omit<FileRecord, 'download_count' | 'created_at'>) {
  const tagsStr = Array.isArray(file.tags) ? (file.tags as string[]).join(',') : (file.tags ?? '');
  await sql`
    INSERT INTO files (id, name, original_name, blob_url, size, mime_type, title, description, author, license, copyright_year, tags, category)
    VALUES (
      ${file.id},
      ${file.name},
      ${file.original_name},
      ${file.blob_url},
      ${file.size},
      ${file.mime_type},
      ${file.title},
      ${file.description},
      ${file.author},
      ${file.license},
      ${file.copyright_year},
      ${tagsStr},
      ${file.category}
    )
  `;
}

export async function searchFiles(query: string, category?: string): Promise<FileRecord[]> {
  if (category && category !== 'all') {
    const result = await sql<FileRecord>`
      SELECT * FROM files
      WHERE category = ${category}
        AND (
          title ILIKE ${('%' + query + '%')}
          OR description ILIKE ${('%' + query + '%')}
          OR author ILIKE ${('%' + query + '%')}
          OR tags ILIKE ${('%' + query + '%')}
        )
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return result.rows;
  }

  if (query) {
    const result = await sql<FileRecord>`
      SELECT * FROM files
      WHERE title ILIKE ${('%' + query + '%')}
        OR description ILIKE ${('%' + query + '%')}
        OR author ILIKE ${('%' + query + '%')}
        OR tags ILIKE ${('%' + query + '%')}
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return result.rows;
  }

  const result = await sql<FileRecord>`
    SELECT * FROM files ORDER BY created_at DESC LIMIT 50
  `;
  return result.rows;
}

export async function getFile(id: string): Promise<FileRecord | null> {
  const result = await sql<FileRecord>`
    SELECT * FROM files WHERE id = ${id}
  `;
  return result.rows[0] ?? null;
}

export async function incrementDownload(id: string) {
  await sql`
    UPDATE files SET download_count = download_count + 1 WHERE id = ${id}
  `;
}
