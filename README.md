# Copyri

**Copyri** ist eine Datei-Hosting-Plattform, auf der Nutzer Dateien bis zu **5 GB** hochladen, mit Lizenz- und Copyright-Informationen versehen und von anderen durchsuchbar und herunterladbar machen können.

## Features

- **Upload bis 5 GB** — Alle Dateitypen, gespeichert in Vercel Blob
- **Copyright & Lizenz** — Jede Datei bekommt Autor, Jahr und Lizenz (Creative Commons, MIT, GPL, etc.)
- **Suche** — Volltext-Suche über Titel, Beschreibung, Autor und Tags
- **Kategorien** — Bilder, Memes, Audio, Video, Dokumente, Schriften, Code, Sonstiges
- **Download-Counter** — Zählt wie oft eine Datei heruntergeladen wurde

## Stack

- **Framework**: Next.js 14 (App Router)
- **Storage**: Vercel Blob (bis 5 GB pro Datei)
- **Database**: Vercel Postgres
- **Styling**: Tailwind CSS

## Deployment auf Vercel

### 1. Repo mit Vercel verbinden

1. Gehe zu [vercel.com](https://vercel.com) → New Project
2. Wähle das `copyri` Repository aus
3. Klicke **Deploy**

### 2. Storage einrichten

Nach dem ersten Deploy in Vercel:

#### Blob Storage (für Dateien)
1. Vercel Dashboard → Storage → **Create Database** → **Blob**
2. Namen vergeben, dann **Connect** zum Projekt
3. Die `BLOB_READ_WRITE_TOKEN` Variable wird automatisch gesetzt

#### Postgres (für Metadaten)
1. Vercel Dashboard → Storage → **Create Database** → **Postgres**
2. Namen vergeben, dann **Connect** zum Projekt
3. Die `POSTGRES_*` Variablen werden automatisch gesetzt

### 3. Redeploy

Nach dem Verbinden der Datenbanken einmal redeployen:
- Vercel Dashboard → Deployments → **Redeploy**

Die Datenbank-Tabellen werden automatisch beim ersten Request erstellt (`initDB()`).

## Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# .env.local mit den Vercel-Variablen befüllen (aus .env.example)
cp .env.example .env.local
# Werte aus Vercel Dashboard eintragen

# Dev-Server starten
npm run dev
```

## Umgebungsvariablen

Alle Variablen werden automatisch von Vercel gesetzt, wenn Blob und Postgres verbunden sind:

| Variable | Beschreibung |
|----------|-------------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob Token |
| `POSTGRES_URL` | Postgres Connection String |
| `POSTGRES_PRISMA_URL` | Postgres für Prisma |
| `POSTGRES_URL_NON_POOLING` | Direkte Verbindung |
| `POSTGRES_USER` | DB User |
| `POSTGRES_HOST` | DB Host |
| `POSTGRES_PASSWORD` | DB Passwort |
| `POSTGRES_DATABASE` | DB Name |

## Lizenz

MIT
