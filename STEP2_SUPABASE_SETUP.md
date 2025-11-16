# 🔷 SCHRITT 2: Supabase Setup

Supabase ist deine Backend-Lösung: Datenbank + Authentifizierung + Storage + APIs - alles automatisch!

---

## 1. Supabase Account erstellen

1. **Gehe zu:** https://supabase.com
2. **Klicke auf "Start your project"**
3. **Melde dich an mit:**
   - GitHub (empfohlen - dann ist alles verbunden)
   - Oder Email

---

## 2. Neues Projekt erstellen

1. **Klicke auf "New Project"**

2. **Projekt konfigurieren:**
   ```
   Name: sakanera
   Database Password: [Wähle ein starkes Passwort - SPEICHERE ES!]
   Region: Europe (Frankfurt/Central EU) - am nächsten zu dir
   Pricing Plan: Free (0€/Monat, völlig ausreichend für Start)
   ```

3. **Klicke "Create new project"**
   - ⏳ Dauert ca. 2 Minuten

---

## 3. Datenbank-Schema erstellen

### Option A: SQL Editor (Empfohlen - Alles auf einmal)

1. **Öffne den SQL Editor:**
   - In der linken Sidebar: **"SQL Editor"**

2. **Neue Query erstellen:**
   - Klicke **"+ New query"**

3. **SQL-Code einfügen:**
   - Öffne die Datei `supabase_schema.sql` aus deinem Projekt
   - Kopiere den GESAMTEN Inhalt
   - Füge ihn in den SQL Editor ein

4. **Ausführen:**
   - Klicke **"Run"** (oder Strg+Enter)
   - ✅ Du solltest "Success" sehen

5. **Überprüfen:**
   - Gehe zu **"Table Editor"** in der Sidebar
   - Du solltest jetzt diese Tabellen sehen:
     - profiles
     - listings
     - favorites
     - messages

### Option B: Table Editor (Manuell - falls SQL nicht funktioniert)

Falls du lieber die UI verwendest:

**Tabelle: profiles**
1. Table Editor → New table → Name: `profiles`
2. Spalten erstellen:
   - id (uuid, primary key, references auth.users)
   - email (text, unique)
   - first_name (text)
   - last_name (text)
   - phone (text, nullable)
   - age (int4, nullable)
   - occupation (text, nullable)
   - profile_image_url (text, nullable)
   - created_at (timestamptz, default: now())
   - updated_at (timestamptz, default: now())

(Wiederhole für `listings`, `favorites`, `messages` - siehe SQL-Schema)

---

## 4. Row Level Security (RLS) aktivieren

**Was ist RLS?**
RLS stellt sicher, dass User nur ihre eigenen Daten sehen/bearbeiten können.

Die RLS Policies sind bereits im SQL-Schema enthalten und wurden mit erstellt! ✅

**Überprüfen:**
1. Gehe zu **"Authentication"** → **"Policies"**
2. Du solltest die Policies für jede Tabelle sehen

---

## 5. Storage für Bilder einrichten

1. **Öffne "Storage"** in der Sidebar

2. **Erstelle zwei Buckets:**

   **Bucket 1: profile-images**
   - Klicke **"New bucket"**
   - Name: `profile-images`
   - Public: ✅ JA (damit Bilder öffentlich sichtbar sind)
   - Klicke "Create bucket"

   **Bucket 2: listing-images**
   - Klicke **"New bucket"**
   - Name: `listing-images`
   - Public: ✅ JA
   - Klicke "Create bucket"

3. **Storage Policies:**
   - Die Buckets sind jetzt öffentlich lesbar
   - Nur authentifizierte User können hochladen
   - (Policies können später feiner eingestellt werden)

---

## 6. API Keys kopieren

**SEHR WICHTIG - Du brauchst diese für deine App!**

1. **Gehe zu "Project Settings"** (Zahnrad-Icon unten links)

2. **API Section:**
   - Klicke auf **"API"** im Menü

3. **Kopiere diese Werte:**

   ```
   Project URL: 
   https://DEIN-PROJECT-ID.supabase.co
   
   anon/public Key:
   eyJhb... (sehr langer String)
   
   service_role Key: 
   eyJhb... (anderer langer String)
   ```

   **📋 SPEICHERE DIESE IRGENDWO SICHER!**
   (z.B. in einer Textdatei - du brauchst sie gleich)

---

## 7. Authentication konfigurieren

1. **Gehe zu "Authentication"** → **"Providers"**

2. **Email Auth aktivieren:**
   - **Email** sollte bereits aktiviert sein
   - Falls nicht: Toggle auf "Enabled"

3. **Optionale Provider (später):**
   - Google Sign-In
   - GitHub Sign-In
   - Etc.

**Email Bestätigung:**
- Standardmäßig müssen User ihre Email bestätigen
- Für Entwicklung kannst du das deaktivieren:
  - **Settings** → **Auth** → **"Enable email confirmations"** → AUS
  - (Für Production wieder AN machen!)

---

## 8. Database Webhooks (Optional - für Email-Benachrichtigungen)

Später kannst du Webhooks einrichten für:
- Neue Nachrichten
- Neue Listings
- Etc.

Erstmal überspringen - nicht notwendig für MVP!

---

## ✅ Erfolgskontrolle

Du hast jetzt:
- ✅ Supabase Projekt erstellt
- ✅ Datenbank mit 4 Tabellen
- ✅ Row Level Security Policies
- ✅ Storage Buckets für Bilder
- ✅ Authentication aktiviert
- ✅ API Keys kopiert

---

## 📝 Was du jetzt haben solltest:

```
Supabase URL: https://xxxxxxxxxx.supabase.co
Supabase Anon Key: eyJhbGc...
```

**Diese brauchst du für SCHRITT 3!**

---

**Weiter zu SCHRITT 3: VERCEL_DEPLOYMENT.md**
