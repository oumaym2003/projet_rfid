import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import mediapipe as mp  # type: ignore[import-not-found]
from mediapipe.tasks import python  # type: ignore[import-not-found]
from mediapipe.tasks.python import vision  # type: ignore[import-not-found]


MODEL_URL = (
    "https://storage.googleapis.com/mediapipe-models/"
    "hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
)


@dataclass
class Landmark:
    x: float
    y: float
    z: float


@dataclass
class HandData:
    landmark: list[Landmark]


class HandTracker:
    def __init__(self) -> None:
        model_path = self._ensure_model_file()
        options = vision.HandLandmarkerOptions(
            base_options=python.BaseOptions(model_asset_path=str(model_path)),
            running_mode=vision.RunningMode.VIDEO,
            num_hands=1,
            min_hand_detection_confidence=0.35,
            min_hand_presence_confidence=0.35,
            min_tracking_confidence=0.30,
        )
        self.hands = vision.HandLandmarker.create_from_options(options)
        self.timestamp_ms = 0

    def _ensure_model_file(self) -> Path:
        project_root = Path(__file__).resolve().parents[1]
        model_dir = project_root / "assets" / "models"
        model_dir.mkdir(parents=True, exist_ok=True)

        model_path = model_dir / "hand_landmarker.task"
        if not model_path.exists():
            print("[INFO] Telechargement du modele de main en cours...")
            urllib.request.urlretrieve(MODEL_URL, model_path)
            print(f"[INFO] Modele telecharge: {model_path}")
        else:
            print(f"[INFO] Modele local detecte: {model_path}")

        return model_path

    def process(self, frame: Any) -> HandData | None:
        rgb = frame[:, :, ::-1]
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        self.timestamp_ms += 33
        results = self.hands.detect_for_video(mp_image, self.timestamp_ms)

        if results.hand_landmarks:
            hand_landmarks = results.hand_landmarks[0]
            landmarks = [
                Landmark(x=lm.x, y=lm.y, z=lm.z)
                for lm in hand_landmarks
            ]
            return HandData(landmark=landmarks)

        return None

    def close(self) -> None:
        if hasattr(self.hands, "close"):
            self.hands.close()
