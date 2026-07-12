import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copyri — Share files with copyright",
  description:
    "Upload, share and discover files with full copyright and license information. Files up to 5 GB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
