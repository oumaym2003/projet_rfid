# Projet RFID - STT Whisper (démo)

Ce dépôt contient une petite démo de reconnaissance vocale (speech-to-text) avec OpenAI Whisper, utilisée pour retrouver un article dans un inventaire fictif.

Contenu:
- `index.html` : interface web simple pour enregistrer un message vocal et l'envoyer au serveur.
- `server.py` : serveur Flask qui reçoit l'audio, le convertit (si `ffmpeg` disponible), le transcrit avec Whisper, et recherche l'article.
- `uploads/` : dossier où les fichiers uploadés temporaires sont stockés.

Pré-requis (Windows, PowerShell):
- Python 3.8+
- (optionnel mais recommandé) environnement virtuel
- `ffmpeg` installé et dans le `PATH` (recommandé)

Installation rapide (PowerShell):
```powershell
# Créer et activer un venv
python -m venv venv
& .\venv\Scripts\Activate.ps1

# Installer dépendances Python
pip install -U pip
pip install -r requirements.txt
```

Installer `ffmpeg` (option 1 - winget):
```powershell
winget install --id Gyan.FFmpeg -e
```

(Option alternative: télécharger un build depuis https://www.gyan.dev/ffmpeg/builds/ ou https://ffmpeg.org/download.html et ajouter le dossier `bin` à votre `PATH`.)

Exécution:
```powershell
# venv activé
python server.py
```

Puis ouvrir dans le navigateur: `http://127.0.0.1:5000/index.html`

Frontend (React + Vite)
----------------------
Un frontend moderne est inclus dans `frontend/` (Vite + React). Pour lancer le frontend en développement :

```powershell
cd frontend
npm install
npm run dev
```

Le frontend se connecte au backend Flask sur `http://127.0.0.1:5000` pour l'endpoint `/upload_audio`.

Afficher l'interface directement en lançant le serveur
---------------------------------------------------
Si vous voulez lancer le serveur Flask et afficher l'interface React en ouvrant simplement `http://127.0.0.1:5000/`, suivez ces étapes :

1. Construisez (build) le frontend :

```powershell
cd frontend
npm install
npm run build
cd ..
```

2. Lancez le serveur Flask (venv activé) :

```powershell
python server.py
```

Le serveur sert automatiquement les fichiers statiques construits dans `frontend/dist`. Ouvrez `http://127.0.0.1:5000/` et vous verrez l'interface React avec le design.

Notes & améliorations possibles:
- Si l'installation de `torch` échoue, suivez les instructions officielles pour votre GPU/CPU: https://pytorch.org/get-started/locally/
- Vous pouvez améliorer la recherche d'articles avec `rapidfuzz` pour une similarité plus précise.
- Pour déployer sur un réseau, configurez un serveur de production (gunicorn/uvicorn + reverse proxy).

Support: Si vous avez des erreurs à l'installation (installation de torch, erreurs ffmpeg), copiez-collez les messages d'erreur ici et je vous aiderai à les résoudre.
