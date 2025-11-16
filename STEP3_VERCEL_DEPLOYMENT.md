# 🔷 SCHRITT 3: Vercel Deployment

Jetzt verbinden wir alles: GitHub (Code) + Supabase (Backend) + Vercel (Hosting)

---

## 1. Vercel Account erstellen

1. **Gehe zu:** https://vercel.com
2. **Klicke "Sign Up"**
3. **Wähle:** "Continue with GitHub" (empfohlen!)
   - Das verbindet automatisch deinen GitHub Account
   - Vercel kann dann auf deine Repositories zugreifen

4. **Autorisiere Vercel** auf GitHub

---

## 2. Neues Projekt importieren

1. **Auf dem Vercel Dashboard:**
   - Klicke **"Add New..."** → **"Project"**

2. **GitHub Repository auswählen:**
   - Du siehst eine Liste deiner GitHub Repositories
   - Suche nach: **"sakanera"**
   - Klicke **"Import"**

3. **Projekt konfigurieren:**

   ```
   Project Name: sakanera (oder wie du möchtest)
   Framework Preset: Vite (sollte automatisch erkannt werden)
   Root Directory: ./ (Standard)
   Build Command: npm run build (Standard)
   Output Directory: dist (Standard)
   ```

   ⚠️ **NOCH NICHT auf "Deploy" klicken!**

---

## 3. Environment Variables hinzufügen

**SEHR WICHTIG:** Deine Supabase Credentials müssen in Vercel eingetragen werden!

1. **Scrolle runter zu "Environment Variables"**

2. **Füge diese Variables hinzu:**

   **Variable 1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://xxxxxxxxxx.supabase.co
   (Dein Supabase Project URL)
   ```

   **Variable 2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   (Dein Supabase Anon/Public Key)
   ```

3. **Für jede Variable:**
   - Gib den Namen ein
   - Gib den Wert ein
   - Wähle "Production" (und optional "Preview" und "Development")
   - Klicke "Add"

---

## 4. Deployment starten!

1. **Jetzt klicke auf "Deploy"** 🚀

2. **Warte ca. 2-3 Minuten...**
   - Vercel installiert Dependencies
   - Baut deine App
   - Deployed sie auf globales CDN
   - Du siehst Live-Logs

3. **Erfolgsmeldung:**
   - Du siehst Konfetti 🎉
   - Deine App ist live!

---

## 5. Domain & Zugriff

**Deine App ist jetzt erreichbar unter:**
```
https://sakanera.vercel.app
(oder ein ähnlicher Name)
```

**Kopiere den Link und teste die App!**

---

## 6. Custom Domain (Optional)

Wenn du eine eigene Domain hast (z.B. sakanera.de):

1. **Vercel Dashboard → Projekt → Settings → Domains**

2. **Klicke "Add"**
   - Gib deine Domain ein: `sakanera.de`
   - Folge den Anweisungen

3. **DNS Einträge setzen** (bei deinem Domain-Anbieter):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Warte auf DNS-Propagierung** (10 Minuten - 24 Stunden)

5. **Fertig!** Deine App läuft auf deiner eigenen Domain mit automatischem HTTPS

---

## 7. Automatische Deployments

**Das Beste an Vercel:**

Jedes Mal wenn du Code auf GitHub pushst, deployed Vercel automatisch!

```bash
# Mache Änderungen in deinem Code
git add .
git commit -m "Update: XYZ"
git push

# Vercel deployed automatisch in 2-3 Minuten!
```

**In Vercel siehst du:**
- Alle Deployments
- Build-Logs
- Preview-URLs für jeden Branch

---

## 8. Preview Deployments

Wenn du einen neuen Feature-Branch erstellst:

```bash
git checkout -b feature/neue-funktion
# Mache Änderungen
git push origin feature/neue-funktion
```

Vercel erstellt automatisch eine **Preview-URL** für diesen Branch!
- Du kannst die Änderungen testen
- Ohne das Production-Deployment zu beeinflussen

---

## 9. Monitoring & Analytics

**Vercel Dashboard → dein Projekt:**

- **Analytics:** Seitenaufrufe, Performance
- **Logs:** Server-Logs und Fehler
- **Insights:** Core Web Vitals

**Kostenloser Plan beinhaltet:**
- 100 GB Bandwidth
- Unlimited Deployments
- Automatic HTTPS
- Global CDN

---

## 10. Lokale Entwicklung (mit echten Supabase-Daten)

**Für lokale Entwicklung mit echten Daten:**

1. **Erstelle `.env` Datei** im Root-Ordner:
   ```bash
   cp .env.example .env
   ```

2. **Füge deine Supabase Credentials ein:**
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhb...
   ```

3. **Starte Dev-Server:**
   ```bash
   npm run dev
   ```

4. **Deine lokale App** verwendet jetzt die echte Supabase-Datenbank!

---

## 11. Troubleshooting

### Problem: "Build failed"

**Lösung:**
- Überprüfe Build-Logs in Vercel
- Stelle sicher, dass `package.json` korrekt ist
- Teste lokal: `npm run build`

### Problem: "Environment variables not working"

**Lösung:**
- Variables müssen mit `VITE_` beginnen (für Vite)
- Nach Änderung: Neues Deployment triggern
- Redeploy: Vercel Dashboard → Deployments → "..." → "Redeploy"

### Problem: "Supabase connection error"

**Lösung:**
- Überprüfe VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY
- Keys müssen die richtigen sein (nicht Service Role Key!)
- In Browser Console schauen nach Fehlern

### Problem: "RLS Policies blocking requests"

**Lösung:**
- Überprüfe Supabase → Authentication → Policies
- Stelle sicher, dass Policies korrekt sind
- Teste in Supabase SQL Editor mit echten User IDs

---

## ✅ Erfolgskontrolle

Du solltest jetzt haben:
- ✅ App deployed auf Vercel
- ✅ Erreichbar über vercel.app URL
- ✅ Automatische Deployments bei Git Push
- ✅ Environment Variables konfiguriert
- ✅ Verbindung zu Supabase funktioniert
- ✅ Registrierung/Login funktioniert

---

## 🎯 Nächste Schritte

1. **Teste die App vollständig:**
   - Registriere einen Account
   - Erstelle ein Profil
   - Erstelle ein Listing
   - Teste Favoriten
   - Teste Suche/Filter

2. **Teile die URL:**
   - Mit Freunden
   - In Social Media
   - Sammle Feedback

3. **Überwache:**
   - Vercel Analytics
   - Supabase Dashboard
   - User-Feedback

---

## 🚀 Du bist jetzt LIVE!

**Glückwunsch! 🎉**

Deine Mitbewohner-Plattform ist jetzt:
- ✅ Live im Internet
- ✅ Mit echter Datenbank
- ✅ Mit User-Authentifizierung
- ✅ Mit automatischen Updates
- ✅ Auf globalem CDN
- ✅ Mit HTTPS
- ✅ Kostenfrei (für Start)

---

## 📞 Support & Ressourcen

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev

**Bei Problemen:**
1. Überprüfe Vercel Build-Logs
2. Überprüfe Browser Console
3. Überprüfe Supabase Logs
4. Google die Fehlermeldung
5. Stack Overflow / Discord Communities

---

**Viel Erfolg mit sakanera! 🏠🎉**
