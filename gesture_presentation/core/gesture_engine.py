from collections import deque
from typing import Any, Literal


GestureName = Literal["INDEX_UP", "OPEN_HAND", "FIST", "NEXT", "PREV", "NONE"]


class GestureEngine:
    def __init__(self) -> None:
        self.gesture_history: deque[GestureName] = deque(maxlen=6)
        self.swipe_threshold = 0.03
        self.last_positive_motion = 0.0
        self.last_negative_motion = 0.0
        self.last_num_extended = 0
        self.left_zone_counter = 0
        self.right_zone_counter = 0
        self.stable_count = 0
        self.last_raw_gesture: GestureName = "NONE"

    def _is_extended(self, landmarks: list, tip_idx: int, pip_idx: int) -> bool:
        if len(landmarks) <= max(tip_idx, pip_idx):
            return False
        return landmarks[tip_idx].y < landmarks[pip_idx].y

    def _thumb_extended(self, landmarks: list) -> bool:
        # Determine handedness proxy from MCPs, then evaluate thumb horizontal extension.
        right_hand_like = landmarks[5].x < landmarks[17].x
        if right_hand_like:
            return landmarks[4].x < landmarks[3].x
        return landmarks[4].x > landmarks[3].x

    def _majority_gesture(self) -> GestureName:
        if not self.gesture_history:
            return "NONE"

        counts: dict[GestureName, int] = {
            "INDEX_UP": 0,
            "OPEN_HAND": 0,
            "FIST": 0,
            "NEXT": 0,
            "PREV": 0,
            "NONE": 0,
        }
        for g in self.gesture_history:
            counts[g] += 1

        ordered: list[GestureName] = ["INDEX_UP", "OPEN_HAND", "FIST", "NEXT", "PREV", "NONE"]
        best = max(ordered, key=lambda g: counts[g])
        return best

    def detect(self, hand: Any) -> GestureName:
        if hand is None or not hasattr(hand, "landmark"):
            self.gesture_history.append("NONE")
            self.last_raw_gesture = "NONE"
            return "NONE"

        landmarks = hand.landmark
        if len(landmarks) < 21:
            return "NONE"

        thumb = self._thumb_extended(landmarks)
        index_extended = self._is_extended(landmarks, 8, 6)
        middle_extended = self._is_extended(landmarks, 12, 10)
        ring_extended = self._is_extended(landmarks, 16, 14)
        pinky_extended = self._is_extended(landmarks, 20, 18)

        num_extended = sum(
            [thumb, index_extended, middle_extended, ring_extended, pinky_extended]
        )
        self.last_num_extended = num_extended

        fingers = [thumb, index_extended, middle_extended, ring_extended, pinky_extended]
        raw_gesture: GestureName = "NONE"

        # Stable static gestures inspired by the external repository.
        if fingers == [1, 0, 0, 0, 0]:
            raw_gesture = "PREV"
        elif fingers == [0, 0, 0, 0, 1]:
            raw_gesture = "NEXT"
        elif fingers == [0, 1, 0, 0, 0]:
            raw_gesture = "INDEX_UP"
        elif num_extended >= 4:
            raw_gesture = "OPEN_HAND"
        elif num_extended == 0:
            raw_gesture = "FIST"

        self.gesture_history.append(raw_gesture)
        stable_gesture = self._majority_gesture()

        if stable_gesture == self.last_raw_gesture:
            self.stable_count += 1
        else:
            self.stable_count = 1
            self.last_raw_gesture = stable_gesture

        # Only emit navigation after short temporal confirmation.
        if stable_gesture in ("NEXT", "PREV") and self.stable_count >= 2:
            return stable_gesture

        if stable_gesture in ("INDEX_UP", "OPEN_HAND", "FIST"):
            return stable_gesture

        return "NONE"

    def get_debug_info(self) -> dict[str, float | int]:
        return {
            "swipe_threshold": self.swipe_threshold,
            "positive_motion": self.last_positive_motion,
            "negative_motion": self.last_negative_motion,
            "num_extended": self.last_num_extended,
            "history_len": len(self.gesture_history),
            "streak": self.stable_count,
            "lost": 0,
            "lz": 0,
            "rz": 0,
        }
