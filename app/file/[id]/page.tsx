import { notFound } from "next/navigation";
import { getFile, initDB, parseTags } from "@/lib/db";
import { formatBytes, formatDate, LICENSES, CATEGORIES } from "@/lib/utils";
import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";
import { Shield, ArrowLeft, Tag, Calendar, User, Download, FileText } from "lucide-react";

export default async function FilePage({ params }: { params: { id: string } }) {
  await initDB();
  const file = await getFile(params.id);
  if (!file) notFound();

  const license = LICENSES.find((l) => l.value === file.license);
  const category = CATEGORIES.find((c) => c.value === file.category);
  const tags = parseTags(file.tags);

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
        <span className="inline-block text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full mb-4">
          {category?.label ?? file.category}
        </span>

        <h1 className="text-3xl font-bold text-white mb-3">{file.title}</h1>
        {file.description && (
          <p className="text-gray-400 text-lg mb-6">{file.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <User className="w-3.5 h-3.5" />Urheber
            </div>
            <p className="text-white font-medium text-sm truncate">{file.author}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />Jahr
            </div>
            <p className="text-white font-medium text-sm">© {file.copyright_year}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <FileText className="w-3.5 h-3.5" />Größe
            </div>
            <p className="text-white font-medium text-sm">{formatBytes(file.size)}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Download className="w-3.5 h-3.5" />Downloads
            </div>
            <p className="text-white font-medium text-sm">{file.download_count}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-brand-500" />
            <h2 className="font-semibold text-white">Lizenz & Copyright</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Lizenz</span>
              <span className="text-white font-mono bg-gray-800 px-2 py-0.5 rounded">{file.license}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Vollständiger Name</span>
              <span className="text-white">{license?.label ?? file.license}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Copyright</span>
              <span className="text-white">© {file.copyright_year} {file.author}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Hochgeladen am</span>
              <span className="text-white">{formatDate(file.created_at)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 leading-relaxed">
            {file.license === "All-Rights-Reserved" ? (
              <><strong className="text-gray-400">Alle Rechte vorbehalten.</strong> Diese Datei darf ohne ausdrückliche Genehmigung des Urhebers nicht kopiert, verbreitet oder verändert werden.</>
            ) : file.license === "CC0-1.0" ? (
              <><strong className="text-gray-400">Gemeinfrei (CC0).</strong> Der Urheber hat alle Rechte aufgegeben. Die Datei darf frei genutzt, verändert und verbreitet werden — auch ohne Namensnennung.</>
            ) : file.license.startsWith("CC") ? (
              <><strong className="text-gray-400">Creative Commons Lizenz.</strong> Bitte die Lizenzbedingungen unter{" "}
              <a href="https://creativecommons.org/licenses/" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">creativecommons.org</a>{" "}
              beachten. Namensnennung: © {file.copyright_year} {file.author}</>
            ) : (
              <><strong className="text-gray-400">{file.license}.</strong> Bitte die entsprechenden Lizenzbedingungen beachten und den Urheber bei Nutzung nennen.</>
            )}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/?q=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
              >
                <Tag className="w-3 h-3" />{tag}
              </Link>
            ))}
          </div>
        )}

        <DownloadButton fileId={file.id} fileName={file.original_name} />
        <p className="text-center text-gray-600 text-xs mt-4">
          Mit dem Download akzeptierst du die oben genannten Lizenzbedingungen.
        </p>
      </div>
    </div>
  );
}
