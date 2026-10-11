# Artisan Store & Studio 🛍️

Ein moderner Online-Shop mit integriertem Verkäufer-Dashboard, PIN-geschütztem Mitarbeiterbereich (`11042014`), Rabattcode-System (`10pz`), Bestellverfolgung und Live-Support-Chat mit Mitarbeiter-Übergabe.

---

## 🚀 Warum zeigte GitHub Pages eine weiße Seite (Blank White Page)?

Eine leere weiße Seite bei Vite/React auf GitHub Pages hat in der Regel zwei Hauptursachen:

1. **Nicht kompilierte Quelldateien serviert**:
   Wenn in GitHub unter *Settings -> Pages* die Option *"Deploy from a branch: main / (root)"* gewählt wurde, liefert GitHub die unkompilierte Datei `index.html` aus dem Root-Verzeichnis aus (`<script src="/src/main.tsx">`). Da Browser TypeScript-Dateien (`.tsx`) und absolute Pfade (`/src/...`) nicht direkt verstehen, bricht die Ausführung mit einem Fehler ab und die Seite bleibt weiß.
2. **Jekyll-Filterung & Pfad-Probleme**:
   GitHub Pages führt standardmäßig Jekyll aus, welches Dateien mit Unterstrichen oder in `assets/` filtern kann, wenn keine `.nojekyll`-Datei vorhanden ist. Zudem müssen die Asset-Pfade relativ (`base: './'`) sein, damit sie auch in Unterordnern (z. B. `https://benutzer.github.io/mein-repo/`) gefunden werden.

---

## ✅ Lösung: So aktivierst du GitHub Pages richtig

Es gibt zwei einfache Wege – **Methode 1** ist die modernste und empfohlene:

### Methode 1: Automatisch über GitHub Actions (Empfohlen ⭐)

Die automatische Workflow-Datei `.github/workflows/deploy.yml` ist bereits eingerichtet!

1. Lade dein Projekt auf GitHub hoch (`git push origin main`).
2. Öffne dein GitHub-Repository im Browser.
3. Gehe auf **Settings** ➔ **Pages** (im linken Menü).
4. Wähle unter **Build and deployment** bei **Source**:
   👉 **GitHub Actions** (statt *Deploy from a branch*).
5. Das war's schon! Bei jedem Push baut GitHub das Projekt automatisch (`npm run build`) und veröffentlicht den fertigen `dist/`-Ordner fehlerfrei.

---

### Methode 2: Manuell via `gh-pages` Branch

Falls du lieber den Branch-Weg nutzen möchtest, ist das `gh-pages`-Paket vorkonfiguriert:

1. Führe im Terminal aus:
   ```bash
   npm run deploy
   ```
   *(Dieser Befehl führt automatisch `npm run build` aus und lädt den Inhalt von `dist/` in den Branch `gh-pages` hoch).*
2. Gehe in deinem GitHub-Repository auf **Settings** ➔ **Pages**.
3. Wähle unter **Source**: **Deploy from a branch**.
4. Wähle als Branch **`gh-pages`** und Ordner **`/(root)`** und klicke auf **Save**.

---

## 🛠️ Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (Port 3000)
npm run dev

# Produktions-Build erstellen
npm run build
```

## 🔑 Wichtige Zugangsdaten & Features
- **Mitarbeiter-PIN**: `11042014` (schaltet das Verkäufer-Dashboard & Bestellverwaltung frei)
- **Rabattcode**: `10pz` (10 % Rabatt auf den gesamten Einkauf)
- **Sicherheits-Alarm**: Falsche PIN-Eingaben werden protokolliert und dem Mitarbeiter angezeigt
- **Bestellstatus**: Neu ➔ In Zubereitung ➔ Im Versand ➔ Abgeschlossen (abgeschlossene Produkte wandern automatisch ins Archiv)
- **Support-Chat**: AI-Bot mit sofortiger menschlicher Übergabe, wenn der Kunde danach fragt
