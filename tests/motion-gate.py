#!/usr/bin/env python3
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
main = (root / "main.js").read_text()
scene = (root / "scene.js").read_text()
html = (root / "index.html").read_text()
fail = 0


def check(label, ok):
    global fail
    print(("OK: " if ok else "FAIL: ") + label)
    if not ok:
        fail = 1


check("no SplitText", "SplitText" not in main and "SplitText" not in html)
check("no section reveal stagger", "querySelectorAll(\".reveal-item\")" not in main)
check("no hero autoplay", "onLeave" not in main and "onEnterBack" not in main)
check("no process is-live decoration", "proc-step" not in main)
check("commitment micros only", "querySelectorAll(\".commit\")" in main)
check("no global data-control hover", "data-control" not in main)
check("reduced motion opens on after", 'setMode(prefersReduced() ? "after" : "before"' in main)
check("process progress still locked", "locked: Boolean(demo && demo.dataset.locked)" in main)
check("one 3D object — no ticket mesh", "paintTicket" not in scene and "ticket =" not in scene)
check("no idle pointer tilt", "pointermove" not in scene)
check("lazy Three import", "IntersectionObserver" in scene and "import(THREE_URL)" in scene)
check("reduced motion uses booked fallback", 'showFallback("after")' in scene)
check("locked progress does not force after", "if (locked)" in scene)

sys.exit(fail)
