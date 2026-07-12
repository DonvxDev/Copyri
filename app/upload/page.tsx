"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Upload, X, FileText, ArrowLeft } from "lucide-react";
import { LICENSES, CATEGORIES, MAX_FILE_SIZE, formatBytes } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    license: "CC-BY-4.0",
    copyrightYear: new Date().getFullYear().toString(),
    tags: "",
    category: "image",
  });

  function handleFile(f: File) {
    if (f.size > MAX_FILE_SIZE) {
      setError("Die Datei ist zu groß. Maximum: 5 GB");
      return;
    }
    setFile(f);
    setError("");
    if (!form.title) {
      setForm((prev) => ({ ...prev, title: f.name.replace(/\.[^/.]+$/, "") }));
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Bitte eine Datei auswählen.");

    setUploading(true);
    setProgress(10);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 5, 85));
      }, 500);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      clearInterval(interval);
      setProgress(100);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-white">Copyri</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-white mb-2">Datei hochladen</h1>
        <p className="text-gray-400 mb-8">Bis zu 5 GB · Mit Lizenz und Copyright-Infos</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop zone */}
          <div
            className={`upload-zone rounded-xl p-10 text-center cursor-pointer ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" className="hidden" onChange={onInputChange} />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-brand-500" />
                <div className="text-left">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="ml-4 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  Datei hierher ziehen oder <span className="text-brand-500">klicken</span>
                </p>
                <p className="text-gray-600 text-sm mt-1">Max. 5 GB · Alle Dateitypen</p>
              </div>
            )}
          </div>

          {/* Title + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Titel *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
                placeholder="Name der Datei"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kategorie *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Beschreibung</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500 resize-none"
              placeholder="Kurze Beschreibung der Datei..."
            />
          </div>

          {/* Author + Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Urheber / Autor *</label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
                placeholder="Dein Name oder Pseudonym"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Copyright-Jahr *</label>
              <input
                type="number"
                required
                min="1900"
                max={new Date().getFullYear()}
                value={form.copyrightYear}
                onChange={(e) => setForm({ ...form, copyrightYear: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* License */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Lizenz *</label>
            <select
              required
              value={form.license}
              onChange={(e) => setForm({ ...form, license: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
            >
              {LICENSES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              placeholder="meme, cat, funny (kommagetrennt)"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Wird hochgeladen...</span>
                <span className="text-brand-500">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Wird hochgeladen..." : "Hochladen"}
          </button>
        </form>
      </div>
    </div>
  );
}
