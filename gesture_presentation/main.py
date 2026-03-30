import cv2  # type: ignore[import-not-found]
from core.hand_tracker import HandTracker  # type: ignore[import-not-found]
from core.gesture_engine import GestureEngine  # type: ignore[import-not-found]
from core.action_controller import ActionController  # type: ignore[import-not-found]
from typing import Any


def draw_label(frame, text: str, x: int, y: int, color: tuple[int, int, int], scale: float = 0.65, thickness: int = 2) -> None:
    font = cv2.FONT_HERSHEY_SIMPLEX
    (w, h), baseline = cv2.getTextSize(text, font, scale, thickness)
    pad = 6
    cv2.rectangle(
        frame,
        (x - pad, y - h - pad),
        (x + w + pad, y + baseline + pad),
        (20, 20, 20),
        -1,
    )
    cv2.putText(frame, text, (x, y), font, scale, (0, 0, 0), thickness + 2, cv2.LINE_AA)
    cv2.putText(frame, text, (x, y), font, scale, color, thickness, cv2.LINE_AA)


def draw_debug_overlay(frame, hand_data, gesture: str, debug_enabled: bool, debug_info: dict[str, Any]) -> None:
    if not debug_enabled:
        return

    frame_h, frame_w = frame.shape[:2]

    if hand_data is not None and hasattr(hand_data, "landmark"):
        for landmark in hand_data.landmark:
            x = int(landmark.x * frame_w)
            y = int(landmark.y * frame_h)
            cv2.circle(frame, (x, y), 3, (0, 255, 255), -1)

    gesture_display = gesture.replace("_", " ")
    draw_label(frame, f"Gesture: {gesture_display}", 10, 30, (0, 255, 0), scale=0.9, thickness=2)
    draw_label(frame, "Debug: ON (press D to toggle)", 10, 62, (255, 220, 0), scale=0.65, thickness=2)
    draw_label(frame, "INDEX_UP | OPEN_HAND | FIST", 10, 90, (120, 220, 255), scale=0.55, thickness=1)
    draw_label(
        frame,
        f"ext={debug_info.get('num_extended', 0)} hist={debug_info.get('history_len', 0)} streak={debug_info.get('streak', 0)} lost={debug_info.get('lost', 0)} lz={debug_info.get('lz', 0)} rz={debug_info.get('rz', 0)}",
        10,
        116,
        (190, 255, 190),
        scale=0.52,
        thickness=1,
    )
    draw_label(
        frame,
        f"dx+={debug_info.get('positive_motion', 0.0):.3f} dx-={debug_info.get('negative_motion', 0.0):.3f} thr={debug_info.get('swipe_threshold', 0.0):.3f}",
        10,
        141,
        (190, 255, 190),
        scale=0.52,
        thickness=1,
    )


def main() -> None:
    tracker = HandTracker()
    gesture_engine = GestureEngine()
    actions = ActionController()
    cap = cv2.VideoCapture(0)
    debug_enabled = False
    last_gesture_cooldown = 0

    if not cap.isOpened():
        tracker.close()
        return

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            tracking_frame = cv2.resize(frame, (0, 0), fx=0.8, fy=0.8)
            hand_data = tracker.process(tracking_frame)
            detected_gesture = "NONE"
            debug_info: dict[str, Any] = {}

            if hand_data:
                detected_gesture = gesture_engine.detect(hand_data)
                debug_info = gesture_engine.get_debug_info()
                if detected_gesture == "NEXT" and last_gesture_cooldown == 0:
                    last_gesture_cooldown = 15
                    actions.execute("NEXT", hand_data)
                elif detected_gesture == "PREV" and last_gesture_cooldown == 0:
                    last_gesture_cooldown = 15
                    actions.execute("PREV", hand_data)
            else:
                debug_info = gesture_engine.get_debug_info()

            if last_gesture_cooldown > 0:
                last_gesture_cooldown -= 1

            draw_debug_overlay(frame, hand_data, detected_gesture, debug_enabled, debug_info)

            cv2.imshow("Smart Presentation", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord("d"):
                debug_enabled = not debug_enabled
            if key == 27:
                break
    finally:
        cap.release()
        tracker.close()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()