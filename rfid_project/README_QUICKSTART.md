# project_rfid — Quickstart

Petit guide rapide pour cloner et lancer le projet localement (Windows / PowerShell).

## Lien du dépôt

https://github.com/oumaym2003/project_rfid.git

## Prérequis

- Python 3.10+ (venv)
- Node.js 16+ et `npm`
- `ffmpeg` (optionnel, nécessaire si vous utilisez la transcription côté serveur)

## Installer et lancer (PowerShell)

1) Cloner le dépôt

```powershell
git clone https://github.com/oumaym2003/project_rfid.git
cd project_rfid
```

2) Backend (Python)

```powershell
# créer et activer l'environnement
python -m venv venv
.\venv\Scripts\Activate.ps1

# installer dépendances Python
pip install -r requirements.txt
```

3) Frontend (build production)

```powershell
Set-Location -Path .\frontend
npm install
npm run build
```

4) Lancer le serveur (depuis la racine du projet)

```powershell
Set-Location -Path ..\   # si vous êtes dans frontend, retour à la racine
.\venv\Scripts\Activate.ps1
python server.py
```

Ouvrir ensuite `http://127.0.0.1:5000` dans le navigateur.

## Développement (hot-reload)

Pour le développement frontend seulement (hot-reload) :

```powershell
Set-Location -Path .\frontend
npm install
npm run dev

# ouvrir http://localhost:5173
```

Note : l'API de transcription (Whisper) est fournie par le backend Flask, qui doit être lancé séparément si vous testez l'upload audio.

## Remarques

- Si le push Git échoue pour authentification : utilisez un PAT (token) ou configurez SSH. Je peux aider si besoin.
- Le dépôt peut contenir assets lourds (images) — le build peut être volumineux.

Bon codage ! 👋
