#!/usr/bin/env python3
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
main = (root / "main.js").read_text()
scene = (root / "scene.js").read_text()
fail = 0


def check(label, ok):
    global fail
    print(("OK: " if ok else "FAIL: ") + label)
    if not ok:
        fail = 1


check(
    "no section reveal-item stagger",
    ".reveal-section" not in main or "querySelectorAll(\".reveal-item\")" not in main,
)
check(
    "process progress carries the toggle lock",
    "locked: Boolean(demo && demo.dataset.locked)" in main,
)
check(
    "3D process progress bails when locked",
    "if (locked)" in scene and "applyMode(\"after\")" in scene,
)
check(
    "locked process progress does not applyMode",
    "if (locked)" in scene
    and scene.split("hbc:process-progress")[1].split("visibilitychange")[0].count("applyMode") == 0
    or (
        "if (locked)" in scene
        and "applyTicket(state.mode === \"after\" ? 1 : 0)" in scene
        and "return;" in scene.split("hbc:process-progress")[1].split("visibilitychange")[0]
    ),
)

handler = scene.split("hbc:process-progress")[1].split("visibilitychange")[0]
check(
    "locked branch returns before applyMode",
    "if (locked)" in handler and handler.find("if (locked)") < handler.find("applyMode"),
)

sys.exit(fail)
