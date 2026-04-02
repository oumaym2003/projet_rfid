import os
import time
import subprocess
import shutil
import whisper
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from difflib import get_close_matches
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
DEBUG_MODE = os.getenv('FLASK_DEBUG', '').lower() in ('1', 'true', 'yes', 'on')

# dossier pour stocker l'audio uploadé
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Limiter la taille des uploads (10 MB)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Charger Whisper
print("Chargement du modèle Whisper (small)...")
model = whisper.load_model("small")

# Base d'exemple (articles)
inventory = {
    "chaussures adidas modele 12": {
        "armoire": "A1",
        "niveau": 2,
        "coords": (3.4, 1.2),
        "trajectoire": ["Couloir 1", "Droite 2", "A1"]
    },
    "chemise bleue taille m": {
        "armoire": "B3",
        "niveau": 1,
        "coords": (2.0, 0.5),
        "trajectoire": ["Couloir 2", "Gauche 1", "B3"]
    },
    "vis m3": {
        "armoire": "C2",
        "niveau": 3,
        "coords": (4.1, 2.7),
        "trajectoire": ["Couloir 3", "Droite 3", "C2"]
    }
}

def find_item(query):
    q = query.lower().strip()
    if q in inventory:
        return inventory[q]

    keys = list(inventory.keys())
    matches = get_close_matches(q, keys, n=1, cutoff=0.5)
    if matches:
        return inventory[matches[0]]

    for k, v in inventory.items():
        if all(token in k for token in q.split()):
            return v
    return None

# Route pour servir le frontend
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')


@app.route('/<path:filename>')
def serve_static(filename):
    # If a built frontend exists, serve files from it (single-command deployment).
    if os.path.isdir(FRONTEND_DIST):
        full = os.path.join(FRONTEND_DIST, filename)
        if os.path.exists(full):
            return send_from_directory(FRONTEND_DIST, filename)
    # Fallback to project root (legacy index.html)
    if os.path.exists(filename):
        return send_from_directory('.', filename)
    return "Not Found", 404


@app.route("/index.html")
def index():
    # Prefer the built SPA index if available
    if os.path.isdir(FRONTEND_DIST):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return send_from_directory('.', "index.html")


@app.route('/')
def root():
    # Serve the SPA root when available
    if os.path.isdir(FRONTEND_DIST):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return send_from_directory('.', 'index.html')

# Route upload audio + transcription
@app.route("/upload_audio", methods=["POST"])
def upload_audio():
    # Whole handler wrapped to log unexpected exceptions and return JSON
    try:
        if "audio" not in request.files:
            return jsonify({"error": "Aucun fichier audio fourni"}), 400

        file = request.files["audio"]
        filename = secure_filename(file.filename)
        if filename == "":
            return jsonify({"error": "Nom de fichier vide"}), 400

        # Enregistrer avec un nom horodaté pour éviter les collisions
        timestamp = int(time.time() * 1000)
        saved_name = f"{timestamp}_{filename}"
        path = os.path.join(app.config["UPLOAD_FOLDER"], saved_name)
        file.save(path)

        # Convertir en WAV 16k mono si ffmpeg est disponible (Whisper fonctionne mieux
        # avec un signal PCM propre). Sinon, on transmet le fichier original.
        # Ensure we don't overwrite the original upload when converting.
        base_noext = os.path.splitext(path)[0]
        wav_path = base_noext + "_conv.wav"
        transcribe_path = path
        if shutil.which("ffmpeg"):
            # If the uploaded file is already a WAV and conversion would target the same
            # filename, write to a separate file (`*_conv.wav`) to avoid ffmpeg errors.
            subprocess.run(["ffmpeg", "-y", "-i", path, "-ar", "16000", "-ac", "1", wav_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            transcribe_path = wav_path

        # Transcription avec Whisper
        result = model.transcribe(transcribe_path, language="fr")
        text = result.get("text", "").strip()

        # Enregistrer la transcription côté serveur (JSON Lines)
        try:
            record = {
                "ts": int(time.time()*1000),
                "file": saved_name,
                "transcription": text
            }
            with open('transcripts.jsonl', 'a', encoding='utf-8') as f:
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
        except Exception:
            app.logger.exception('Impossible d\'écrire la transcription dans transcripts.jsonl')

        # Recherche du produit
        item = find_item(text)
        if not item:
            return jsonify({
                "found": False,
                "text": text,
                "transcription": text,
                "message": "Aucun article correspondant trouvé.",
                "suggestions": list(inventory.keys())
            })

        return jsonify({
            "found": True,
            "text": text,
            "transcription": text,
            "armoire": item["armoire"],
            "niveau": item["niveau"],
            "coords": item.get("coords"),
            "trajectoire": item.get("trajectoire", [])
        })
    except Exception as exc:
        import traceback
        tb = traceback.format_exc()
        app.logger.error("Exception in /upload_audio: %s", tb)
        payload = {
            "error": "Erreur interne serveur",
            "details": str(exc) if DEBUG_MODE else "Consultez les logs serveur."
        }
        if DEBUG_MODE:
            payload["trace"] = tb
        return jsonify(payload), 500
    finally:
        # Nettoyage : supprimer les fichiers temporaires si présents
        try:
            if 'path' in locals() and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass
        try:
            if 'wav_path' in locals() and os.path.exists(wav_path):
                os.remove(wav_path)
        except Exception:
            pass

# Endpoint de statut (ne pas écraser la route `/` qui sert le frontend)
@app.route("/status")
def status():
    return "Serveur Whisper STT OK - frontend servi sur / (ou /index.html)"

if __name__ == "__main__":
    # Exposer le serveur localement (accessible depuis d'autres machines du réseau)
    app.run(host='0.0.0.0', port=5000, debug=DEBUG_MODE)
