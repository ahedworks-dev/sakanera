# 📘 SCHRITT 1: GitHub Setup

## Was du jetzt tun musst:

### 1. GitHub Repository erstellen

1. **Öffne GitHub:**
   - Gehe zu: https://github.com
   - Melde dich an (oder erstelle einen Account)

2. **Neues Repository erstellen:**
   - Klicke auf das **"+"** Icon oben rechts
   - Wähle **"New repository"**

3. **Repository konfigurieren:**
   ```
   Repository name: sakanera
   Description: Mitbewohner-Plattform - Zahle die Hälfte der Miete
   
   ⚠️ WICHTIG:
   ☐ Public (oder Private - deine Wahl)
   ☐ NICHT "Initialize with README" ankreuzen
   ☐ NICHT .gitignore hinzufügen
   ☐ NICHT Lizenz hinzufügen
   
   (Alles ist schon im Projekt vorhanden!)
   ```

4. **Klicke auf "Create repository"**

5. **Kopiere die Repository URL:**
   - Du siehst jetzt eine Seite mit Setup-Anweisungen
   - Kopiere die URL, die so aussieht:
   ```
   https://github.com/DEIN-USERNAME/sakanera.git
   ```

---

## 2. Code auf GitHub pushen

**Öffne ein Terminal** im Projektordner `sakanera-deployment/` und führe folgende Befehle aus:

```bash
# 1. Git ist bereits initialisiert ✓

# 2. Alle Dateien zum Commit hinzufügen
git add .

# 3. Ersten Commit erstellen
git commit -m "Initial commit: sakanera Mitbewohner-Plattform"

# 4. Mit GitHub verbinden (ersetze DEIN-USERNAME mit deinem GitHub Username)
git remote add origin https://github.com/DEIN-USERNAME/sakanera.git

# 5. Code auf GitHub pushen
git push -u origin main
```

**Bei erster Verwendung:**
- Git wird nach deinem GitHub Username und Password (oder Token) fragen
- Verwende ein **Personal Access Token** statt Passwort (GitHub empfiehlt das)
- Token erstellen: GitHub → Settings → Developer settings → Personal access tokens → Generate new token

---

## ✅ Erfolgskontrolle

Aktualisiere die GitHub-Seite - du solltest jetzt alle Projektdateien sehen!

---

## 🔄 Zukünftige Updates pushen

```bash
git add .
git commit -m "Beschreibung deiner Änderung"
git push
```

---

**Weiter zu SCHRITT 2: SUPABASE_SETUP.md**
