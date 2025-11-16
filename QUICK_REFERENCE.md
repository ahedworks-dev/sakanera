# 🚀 QUICK REFERENCE - Cheat Sheet

Alle wichtigen Befehle und URLs auf einen Blick!

---

## 📦 Die 3 Hauptschritte (Kurzfassung)

### 1️⃣ GITHUB (5 Min)
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/DEIN-USERNAME/sakanera.git
git push -u origin main
```

### 2️⃣ SUPABASE (10 Min)
1. supabase.com → Neues Projekt
2. SQL Editor → `supabase_schema.sql` einfügen → Run
3. Settings → API → Keys kopieren

### 3️⃣ VERCEL (5 Min)
1. vercel.com → Import "sakanera"
2. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

---

## 💻 Lokale Entwicklung

```bash
# Setup
npm install
cp .env.example .env
# Fülle .env mit Supabase Credentials

# Development Server starten
npm run dev              # → http://localhost:3000

# Production Build testen
npm run build
npm run preview          # → http://localhost:4173
```

---

## 🔧 Git Befehle

```bash
# Initialisierung
git init
git branch -m main

# Status prüfen
git status

# Änderungen committen
git add .
git commit -m "Deine Nachricht"

# Auf GitHub pushen
git push

# Branch erstellen
git checkout -b feature/neue-funktion
git push origin feature/neue-funktion

# Änderungen pullen
git pull
```

---

## 📁 Projekt-Struktur

```
sakanera-deployment/
├── src/
│   ├── App.jsx              # Haupt-App Komponente
│   ├── main.jsx             # React Entry Point
│   ├── index.css            # Tailwind Styles
│   └── supabaseClient.js    # Supabase Integration
├── index.html               # HTML Entry
├── package.json             # Dependencies
├── vite.config.js           # Vite Config
├── tailwind.config.js       # Tailwind Config
├── supabase_schema.sql      # DB Schema
├── .env.example             # Environment Template
├── .gitignore               # Git Ignore Rules
└── START_HERE.md            # Start Anleitung
```

---

## 🔑 Environment Variables

**Lokal (.env Datei):**
```bash
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**In Code verwenden:**
```javascript
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
```

---

## 🗄️ Supabase Datenbank

**Tabellen:**
- `profiles` - Benutzerprofile
- `listings` - Inserate
- `favorites` - Favoriten
- `messages` - Nachrichten

**Storage Buckets:**
- `profile-images` - Profilbilder
- `listing-images` - Listing Bilder

---

## 🔐 Supabase Helper Funktionen

```javascript
import { 
  authHelpers,      // Login, Register, Logout
  profileHelpers,   // Profile CRUD
  listingHelpers,   // Listings CRUD
  favoriteHelpers,  // Favorites CRUD
  storageHelpers    // Bild-Uploads
} from './supabaseClient';

// Beispiele:
await authHelpers.signUp(email, password, userData)
await authHelpers.signIn(email, password)
await authHelpers.signOut()

await profileHelpers.getProfile(userId)
await profileHelpers.createProfile(userId, data)
await profileHelpers.updateProfile(userId, updates)

await listingHelpers.getAllListings(filters)
await listingHelpers.createListing(data)
await listingHelpers.deleteListing(listingId)

await favoriteHelpers.addFavorite(userId, listingId)
await favoriteHelpers.removeFavorite(userId, listingId)

await storageHelpers.uploadProfileImage(userId, file)
await storageHelpers.uploadListingImage(listingId, file)
```

---

## 🌐 Wichtige URLs

**Entwicklung:**
- Local Dev: `http://localhost:3000`
- Local Preview: `http://localhost:4173`

**Production:**
- Vercel: `https://dein-projekt.vercel.app`
- Custom Domain: `https://sakanera.de` (nach Setup)

**Dashboards:**
- GitHub: `https://github.com/DEIN-USERNAME/sakanera`
- Supabase: `https://supabase.com/dashboard/project/PROJEKT-ID`
- Vercel: `https://vercel.com/DEIN-USERNAME/sakanera`

---

## 🐛 Debugging

**Browser Console öffnen:**
- Chrome/Edge: `F12` oder `Strg+Shift+I`
- Firefox: `F12` oder `Strg+Shift+K`
- Safari: `Cmd+Option+I`

**Häufige Fehler:**

```javascript
// Supabase Connection Error
→ Environment Variables überprüfen
→ Supabase URL korrekt?
→ Anon Key (nicht Service Role Key!)

// Auth Error
→ User registriert?
→ Email bestätigt? (wenn aktiviert)
→ RLS Policies korrekt?

// Build Error
→ Lokal testen: npm run build
→ Dependencies installiert? npm install
→ Node Version? node --version

// Deploy Error auf Vercel
→ Build Logs überprüfen
→ Environment Variables gesetzt?
→ Branch korrekt?
```

---

## 📊 Monitoring

**Vercel Dashboard:**
- Analytics → Seitenaufrufe
- Logs → Fehler und Warnings
- Deployments → Deployment History

**Supabase Dashboard:**
- Database → Table Editor
- Auth → User Management
- Storage → Uploaded Files
- Logs → Database Logs

---

## 🔄 Update Workflow

```bash
# 1. Änderungen machen
# 2. Lokal testen
npm run dev

# 3. Committen und pushen
git add .
git commit -m "Feature: XYZ"
git push

# 4. Vercel deployed automatisch!
# 5. Nach ~2 Min live auf vercel.app
```

---

## 🆘 Hilfe

**Dokumentation:**
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

**Support:**
- Supabase Discord
- Vercel Community
- Stack Overflow

---

## ✅ Pre-Deployment Checklist

- [ ] `npm install` erfolgreich
- [ ] `npm run build` funktioniert
- [ ] `.env` Datei erstellt (lokal)
- [ ] Supabase Credentials korrekt
- [ ] Git Repository erstellt
- [ ] Code auf GitHub gepusht
- [ ] Supabase Projekt erstellt
- [ ] DB Schema eingespielt
- [ ] Storage Buckets erstellt
- [ ] Vercel mit GitHub verbunden
- [ ] Environment Variables in Vercel
- [ ] Deployed!

---

## 🎯 Nach dem Deployment

```bash
# Testen
✓ Registrierung
✓ Login
✓ Profil erstellen
✓ Listing erstellen
✓ Favoriten
✓ Suche/Filter

# Teilen
✓ URL kopieren
✓ Mit Freunden teilen
✓ Feedback sammeln

# Iterieren
✓ Verbesserungen machen
✓ Git push
✓ Automatisches Deployment!
```

---

**🎉 Du hast es geschafft!**

Für Details siehe die jeweiligen STEP-Dateien!
