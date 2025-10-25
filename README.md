# 🚀 Sakanera - Vercel Deployment Guide

## ✅ Dieses Projekt ist **READY FÜR VERCEL!**

---

## 🎯 Option 1: Deployment über Vercel Dashboard (EINFACHSTE METHODE)

### Schritt 1: Projekt als ZIP hochladen

1. **Lade dieses Projekt als ZIP herunter**
2. Gehe zu [vercel.com](https://vercel.com)
3. Logge dich ein (oder erstelle kostenlosen Account)
4. Klicke auf **"Add New..."** → **"Project"**
5. Klicke auf **"Browse"** und wähle die **ZIP-Datei** aus
6. Vercel erkennt automatisch das Vite-Projekt
7. Klicke auf **"Deploy"**

⏱️ Nach 2-3 Minuten ist deine Seite live unter: `https://deinprojektname.vercel.app`

---

### Schritt 2: Eigene Domain verbinden (sakanera.com)

1. In deinem Vercel-Projekt: **Settings** → **Domains**
2. Klicke auf **"Add"**
3. Gib ein: `sakanera.com`
4. Vercel zeigt dir DNS-Einstellungen an

#### Bei deinem Domain-Anbieter (wo du sakanera.com gekauft hast):

**DNS-Einträge hinzufügen:**

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

⏱️ Nach 1-24 Stunden ist **sakanera.com** live!

---

## 🎯 Option 2: Deployment über GitHub (EMPFOHLEN für Updates)

### Vorteile:
- ✅ Automatisches Re-Deployment bei Code-Änderungen
- ✅ Versionskontrolle
- ✅ Einfacher für Team-Zusammenarbeit

### Schritte:

#### 1. GitHub Repository erstellen:

1. Gehe zu [github.com](https://github.com)
2. Klicke auf **"New Repository"**
3. Name: `sakanera`
4. **Private** oder Public wählen
5. **"Create repository"**

#### 2. Code hochladen:

```bash
# In deinem Projekt-Ordner (Terminal):
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEINUSERNAME/sakanera.git
git push -u origin main
```

#### 3. Mit Vercel verbinden:

1. Auf [vercel.com](https://vercel.com) einloggen
2. **"Add New..."** → **"Project"**
3. **"Import Git Repository"**
4. Wähle dein GitHub Repository
5. Framework: **Vite** (wird automatisch erkannt)
6. **"Deploy"** klicken

🎉 **Fertig!** Jetzt wird bei jedem `git push` automatisch neu deployed!

---

## 🎯 Option 3: Vercel CLI (für Entwickler)

```bash
# Vercel CLI installieren
npm install -g vercel

# Im Projekt-Ordner:
vercel login
vercel

# Folge den Anweisungen im Terminal
```

---

## 📊 Nach dem Deployment

### Deine Live-URLs:

- **Vercel-URL**: `https://sakanera.vercel.app` (sofort verfügbar)
- **Custom Domain**: `https://sakanera.com` (nach DNS-Setup)

### Wichtige Vercel-Features:

1. **Analytics** - Besucher-Statistiken ansehen
2. **Logs** - Fehler und Performance überwachen
3. **Preview Deployments** - Jeder Git-Branch bekommt eigene URL zum Testen
4. **Environment Variables** - Für API-Keys, etc.

---

## 🔧 Lokale Entwicklung

### Installation:

```bash
npm install
```

### Development Server starten:

```bash
npm run dev
```

Öffne: `http://localhost:5173`

### Production Build testen:

```bash
npm run build
npm run preview
```

---

## 📁 Projektstruktur

```
sakanera-web/
├── public/              # Statische Dateien (Favicon, etc.)
├── src/
│   ├── App.jsx         # Hauptkomponente der App
│   └── main.jsx        # React Entry Point
├── index.html          # HTML Template
├── package.json        # Dependencies
├── vite.config.js      # Vite Konfiguration
└── vercel.json         # Vercel Einstellungen
```

---

## 🆘 Troubleshooting

### Problem: 404 NOT_FOUND Fehler

**Lösung:** Stelle sicher, dass:
- ✅ `vercel.json` existiert (für Routing)
- ✅ Build erfolgreich war (check Vercel Logs)
- ✅ `dist/` Ordner wird generiert

### Problem: Build Failed

**Häufigste Ursache:** Dependencies fehlen

```bash
# Lokal testen:
npm install
npm run build
```

Wenn lokaler Build funktioniert, auf Vercel erneut deployen.

### Problem: Vercel findet package.json nicht

**Lösung:** 
- In Vercel Settings → Build & Development Settings
- Root Directory: `.` (leer lassen oder Root)

### Problem: Domain zeigt alte Version

**Lösung:** Cache löschen
- In Vercel: Settings → Domains → Domain auswählen → **"Refresh"**
- Oder warte 10-30 Minuten für DNS-Propagierung

---

## 🎨 Anpassungen vornehmen

### Farben ändern:

In `src/App.jsx` suche nach:
- `bg-sky-400` → Hauptfarbe (Blau)
- `bg-sky-500` → Dunklere Variante
- `text-sky-600` → Text in Blau

Ersetze `sky` durch andere Tailwind-Farben:
- `blue`, `purple`, `green`, `red`, `pink`, etc.

### Texte ändern:

Alle Texte sind in der `t` (Translation) Variable in `src/App.jsx`:
- Deutsch: `t.de`
- Englisch: `t.en`

### Features hinzufügen:

Bearbeite `src/App.jsx` und deploye erneut:

```bash
git add .
git commit -m "Neue Features"
git push
```

Vercel baut automatisch neu! ⚡

---

## 📈 Performance & SEO

### Bereits implementiert:

- ✅ Meta Tags für SEO
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Schnelle Ladezeiten mit Vite
- ✅ Production-optimierter Build

### Empfohlene Erweiterungen:

1. **Google Analytics** hinzufügen
2. **Sitemap.xml** erstellen
3. **robots.txt** hinzufügen
4. **Open Graph Tags** für Social Media

---

## 💰 Kosten

### Vercel:

- **Hobby Plan**: **KOSTENLOS** ✅
  - Unbegrenzte Deployments
  - 100 GB Bandwidth/Monat
  - Automatisches HTTPS
  - Custom Domain

- **Pro Plan**: $20/Monat (optional)
  - Mehr Bandwidth
  - Team-Features
  - Advanced Analytics

### Domain (sakanera.com):

- ~10-15€/Jahr (je nach Anbieter)

---

## 🚀 Updates veröffentlichen

### Via GitHub (automatisch):

```bash
# Änderungen machen
# Dann:
git add .
git commit -m "Beschreibung der Änderung"
git push
```

✨ Vercel deployed automatisch in 2-3 Minuten!

### Via Vercel Dashboard:

1. Neuen Code als ZIP hochladen
2. In Vercel: **Deployments** → **Redeploy**

---

## 📞 Support

### Hilfreiche Links:

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

### Bei Problemen:

- Vercel Status: https://vercel-status.com
- Community: https://github.com/vercel/vercel/discussions

---

## ✅ Checkliste vor Go-Live:

- [ ] Projekt auf Vercel deployed
- [ ] Keine Console Errors
- [ ] Mobile-Ansicht getestet
- [ ] Alle Links funktionieren
- [ ] Domain verbunden (sakanera.com)
- [ ] SSL-Zertifikat aktiv (automatisch von Vercel)
- [ ] Datenschutzerklärung verlinkt
- [ ] Impressum vorhanden
- [ ] Google Analytics eingerichtet (optional)
- [ ] Favicon wird angezeigt

---

## 🎉 Zusammenfassung

**So einfach geht's:**

1. ✅ Projekt als ZIP auf Vercel hochladen
2. ✅ Deploy klicken
3. ✅ Domain verbinden
4. ✅ **FERTIG!**

Deine App läuft jetzt weltweit auf Vercel's CDN! 🌍

---

**Viel Erfolg mit Sakanera!** 🚀

Bei Fragen einfach melden! 😊
