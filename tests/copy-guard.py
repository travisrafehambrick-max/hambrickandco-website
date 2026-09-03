#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
pages = [root / name for name in ("index.html", "styles.css", "main.js", "scene.js")]
text = "\n".join(path.read_text() for path in pages)
fail = 0


def check(label, pattern):
    global fail
    if re.search(pattern, text):
        print(f"FAIL: {label}")
        fail = 1
    else:
        print(f"OK: {label}")


def need(label, pattern):
    global fail
    if re.search(pattern, text):
        print(f"OK: {label}")
    else:
        print(f"FAIL: missing {label}")
        fail = 1


check("dollar amounts", r"\$[0-9]|\$1,500|\$300")
check("starting at", r"(?i)starting at")
check("growth partner", r"(?i)growth partner")
check("OpsPatch", r"(?i)opspatch")
check("internal staff", r"\b(Alfred|Manor|n8n)\b")
check("banned marketing verbs", r"\b(seamless|elevate|empower|unlock)\b")
check("AI-powered headline", r"AI-powered|AI employee")
check("invented research scores", r"297 businesses")

need("hello@ email", r"hello@hambrickco.com")
need("phone", r"\(434\) 260-0823")
need("Travis", r"Travis Hambrick")
need("Charlottesville", r"Charlottesville")
need("forty-mile radius", r"forty-mile|40-mile|40 mile")

sys.exit(fail)
