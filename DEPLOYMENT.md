# 🚀 Schnell-Deployment Anleitung

## Schnellster Weg: Vercel (2 Minuten)

### Variante 1: Mit Vercel CLI (Am schnellsten)
```bash
# 1. Dependencies installieren
npm install

# 2. Vercel CLI installieren (einmalig)
npm install -g vercel

# 3. Deployen
vercel

# Fertig! Folge den Anweisungen im Terminal
```

### Variante 2: Über Vercel Website
```bash
# 1. Build erstellen
npm install
npm run build

# 2. Gehe zu vercel.com
# 3. Drag & Drop den dist/ Ordner
# 4. Fertig!
```

---

## Alternative: Netlify (3 Minuten)

```bash
# 1. Build erstellen
npm install
npm run build

# 2. Gehe zu netlify.com
# 3. Drag & Drop den dist/ Ordner
# 4. Fertig!
```

---

## Lokaler Test

```bash
# Installation
npm install

# Development Server
npm run dev
# → http://localhost:3000

# Production Build testen
npm run build
npm run preview
# → http://localhost:4173
```

---

## Wichtige Dateien

- `package.json` - Projekt-Dependencies
- `vite.config.js` - Build-Konfiguration
- `tailwind.config.js` - Styling-Konfiguration
- `src/main.jsx` - React Entry Point
- `src/App.jsx` - Haupt-Komponente
- `dist/` - Fertiger Build (nach `npm run build`)

---

## Häufige Probleme

**"Command not found: npm"**
→ Installiere Node.js von nodejs.org

**"Module not found"**
→ Führe `npm install` aus

**Weiße Seite nach Deployment**
→ Überprüfe Browser Console
→ Stelle sicher, dass alle Dependencies installiert sind

---

## Support

Vollständige Anleitung: Siehe README.md
