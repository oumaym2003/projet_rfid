import pyautogui  # type: ignore[import-untyped]
from typing import Any, Literal


GestureCommand = Literal["INDEX_UP", "OPEN_HAND", "FIST", "NEXT", "PREV", "NONE"]


class ActionController:
    def execute(self, gesture: GestureCommand, hand_data: Any) -> None:
        _ = hand_data
        if gesture == "NEXT":
            pyautogui.press("right")

        elif gesture == "PREV":
            pyautogui.press("left")

        elif gesture == "INDEX_UP":
            pass

        elif gesture == "OPEN_HAND":
            pass

        elif gesture == "FIST":
            pass
