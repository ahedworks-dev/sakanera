# sakanera - Mitbewohner-Plattform

Eine moderne React-Webanwendung zum Finden von Mitbewohnern und WG-Zimmern.

## 🚀 Schnellstart - Lokale Entwicklung

### Voraussetzungen
- Node.js Version 18 oder höher
- npm oder yarn Package Manager

### Installation und Start

```bash
# 1. Dependencies installieren
npm install

# 2. Entwicklungsserver starten
npm run dev

# Die App läuft jetzt auf http://localhost:3000
```

### Build für Production

```bash
# Production Build erstellen
npm run build

# Build lokal testen
npm run preview
```

Der fertige Build befindet sich im `dist/` Ordner.

---

## 🌐 Deployment Optionen

### Option 1: Vercel (Empfohlen - Am einfachsten)

Vercel bietet kostenloses Hosting mit automatischen Deployments.

**Schritte:**

1. **Vercel Account erstellen:**
   - Gehe zu [vercel.com](https://vercel.com)
   - Melde dich mit GitHub, GitLab oder Email an

2. **Projekt deployen:**
   
   **Variante A - Mit Git (Empfohlen):**
   ```bash
   # Git Repository initialisieren
   git init
   git add .
   git commit -m "Initial commit"
   
   # Auf GitHub pushen (erstelle vorher ein Repository auf github.com)
   git remote add origin https://github.com/DEIN-USERNAME/sakanera.git
   git push -u origin main
   ```
   
   Dann auf Vercel:
   - Klicke auf "New Project"
   - Importiere dein GitHub Repository
   - Vercel erkennt automatisch Vite
   - Klicke auf "Deploy"
   
   **Variante B - Direkt ohne Git:**
   ```bash
   # Vercel CLI installieren
   npm install -g vercel
   
   # Im Projektordner:
   vercel
   ```
   
   Folge den Anweisungen im Terminal.

3. **Fertig!** Deine App ist live unter: `https://dein-projekt.vercel.app`

**Vorteile:**
- ✅ Kostenlos
- ✅ Automatische HTTPS
- ✅ Globales CDN
- ✅ Automatische Deployments bei Git Push

---

### Option 2: Netlify

Netlify ist eine weitere einfache und kostenlose Option.

**Schritte:**

1. **Netlify Account erstellen:**
   - Gehe zu [netlify.com](https://netlify.com)
   - Melde dich an

2. **Deployment:**

   **Variante A - Drag & Drop:**
   ```bash
   # Build erstellen
   npm run build
   ```
   - Gehe zu Netlify Dashboard
   - Ziehe den `dist/` Ordner auf die Drop-Zone
   
   **Variante B - Git Integration:**
   - Verbinde dein GitHub Repository
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Klicke auf "Deploy"

3. **Fertig!** Deine App ist live.

**Vorteile:**
- ✅ Kostenlos
- ✅ Einfaches Drag & Drop Deployment
- ✅ Automatische HTTPS
- ✅ Serverless Functions möglich

---

### Option 3: GitHub Pages

Kostenloses Hosting direkt über GitHub.

**Schritte:**

1. **GitHub Repository erstellen:**
   - Erstelle ein neues Repository auf github.com
   
2. **vite.config.js anpassen:**
   ```javascript
   export default defineConfig({
     base: '/DEIN-REPOSITORY-NAME/',  // ← Wichtig!
     // ... rest der config
   })
   ```

3. **Deploy Script hinzufügen:**
   
   Füge in `package.json` hinzu:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **gh-pages installieren und deployen:**
   ```bash
   npm install --save-dev gh-pages
   npm run deploy
   ```

5. **GitHub Pages aktivieren:**
   - Gehe zu Repository Settings → Pages
   - Source: gh-pages branch
   - Speichern

6. **Fertig!** Deine App ist live unter: `https://DEIN-USERNAME.github.io/DEIN-REPO-NAME/`

---

### Option 4: Eigener Server (VPS/Webhosting)

Für mehr Kontrolle kannst du die App auf deinem eigenen Server hosten.

**Schritte:**

1. **Build erstellen:**
   ```bash
   npm run build
   ```

2. **dist/ Ordner auf Server hochladen:**
   ```bash
   # Mit SCP (SSH)
   scp -r dist/* user@dein-server.de:/var/www/html/
   
   # Oder mit FTP-Client wie FileZilla
   ```

3. **Nginx Konfiguration** (empfohlen):
   ```nginx
   server {
       listen 80;
       server_name deine-domain.de;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Gzip Kompression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

4. **HTTPS mit Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d deine-domain.de
   ```

---

### Option 5: Railway

Modern und entwicklerfreundlich.

**Schritte:**

1. **Railway Account:** [railway.app](https://railway.app)
2. **Neues Projekt:** GitHub Repository verbinden
3. **Automatische Detection:** Railway erkennt Vite automatisch
4. **Deploy**

---

### Option 6: Render

Weitere kostenlose Alternative.

**Schritte:**

1. **Render Account:** [render.com](https://render.com)
2. **New Static Site** erstellen
3. **Repository verbinden**
4. **Build Command:** `npm run build`
5. **Publish Directory:** `dist`

---

## 📋 Technologie-Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Sprache:** JavaScript (ES6+)

## 🔧 Weitere Konfiguration

### Umgebungsvariablen (Optional)

Wenn du API-Keys oder andere Secrets benötigst:

1. Erstelle `.env` Datei:
   ```
   VITE_API_URL=https://api.example.com
   VITE_API_KEY=dein_key
   ```

2. In Code verwenden:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. Bei Hosting-Plattformen:
   - Vercel: Environment Variables im Dashboard
   - Netlify: Site Settings → Environment Variables
   - Railway: Variables Tab

### Custom Domain

**Bei Vercel:**
- Domains Tab → Add Domain
- DNS-Einträge beim Domain-Anbieter setzen

**Bei Netlify:**
- Domain Settings → Add Custom Domain
- DNS konfigurieren

## 🐛 Troubleshooting

**Problem:** "Cannot find module 'react'"
```bash
# Lösung: Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Weiße Seite nach Deployment
- Überprüfe Browser Console auf Fehler
- Stelle sicher, dass `base` in vite.config.js korrekt ist
- Bei GitHub Pages: base muss `/repository-name/` sein

**Problem:** Tailwind CSS funktioniert nicht
```bash
# Sicherstellen, dass PostCSS konfiguriert ist
npm install -D tailwindcss postcss autoprefixer
```

## 📱 Mobile Optimierung

Die App ist bereits responsive und mobile-optimiert durch Tailwind CSS.

## 🔐 Sicherheit

- Keine sensiblen Daten im Frontend-Code speichern
- API-Keys immer als Umgebungsvariablen
- HTTPS verwenden (automatisch bei Vercel/Netlify)

## 📈 Performance

Der Build ist bereits optimiert mit:
- Tree-shaking durch Vite
- Code-splitting
- Minification
- Gzip-Kompression

## 🆘 Support

Bei Fragen oder Problemen:
- Vite Dokumentation: [vitejs.dev](https://vitejs.dev)
- React Dokumentation: [react.dev](https://react.dev)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com)

---

## 🎯 Empfehlung für dein Projekt

Für **sakanera** empfehle ich **Vercel**:
1. Kostenloses Hosting
2. Automatische Deployments
3. Sehr schnell
4. Einfachste Einrichtung
5. Perfekt für React/Vite Apps

```bash
# In 2 Minuten live:
npm install -g vercel
vercel
# Fertig! ✨
```

---

**Viel Erfolg mit deiner Mitbewohner-Plattform! 🏠🎉**
