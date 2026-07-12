"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Upload, Shield, Download, Tag } from "lucide-react";
import { FileRecord } from "@/lib/db";
import { formatBytes, formatDate, CATEGORIES } from "@/lib/utils";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/files?${params}`);
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    const t = setTimeout(fetchFiles, 300);
    return () => clearTimeout(t);
  }, [fetchFiles]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-500" />
            <span className="text-xl font-bold tracking-tight text-white">Copyri</span>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            Hochladen
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Teile Dateien mit{" "}
          <span className="text-brand-500">Copyright-Schutz</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Lade Dateien bis zu 5 GB hoch, vergib Lizenz- und Copyright-Infos und lass andere sie finden und herunterladen.
        </p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder='Suche nach "Cat Meme", "Sounds", "Fotos"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="all">Alle Kategorien</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {query ? `Keine Ergebnisse für "${query}"` : "Noch keine Dateien vorhanden."}
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 mt-4 text-brand-500 hover:text-brand-400 font-medium"
            >
              <Upload className="w-4 h-4" />
              Erste Datei hochladen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <Link
                key={file.id}
                href={`/file/${file.id}`}
                className="group bg-gray-900 border border-gray-800 hover:border-brand-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-brand-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md capitalize">
                    {CATEGORIES.find((c) => c.value === file.category)?.label ?? file.category}
                  </span>
                  <span className="text-xs text-gray-600">{formatBytes(file.size)}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors mb-1 line-clamp-2">
                  {file.title}
                </h3>
                {file.description && (
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{file.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    <span>{file.license}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Download className="w-3 h-3" />
                    <span>{file.download_count}</span>
                  </div>
                </div>
                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {file.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
