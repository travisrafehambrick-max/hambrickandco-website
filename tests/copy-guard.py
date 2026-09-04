#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
pages = [root / name for name in ("index.html", "styles.css", "main.js", "scene.js")]
text = "\n".join(path.read_text() for path in pages)
html = (root / "index.html").read_text()
fail = 0


def check(label, pattern, haystack=text):
    global fail
    if re.search(pattern, haystack):
        print(f"FAIL: {label}")
        fail = 1
    else:
        print(f"OK: {label}")


def need(label, pattern, haystack=text):
    global fail
    if re.search(pattern, haystack):
        print(f"OK: {label}")
    else:
        print(f"FAIL: missing {label}")
        fail = 1


check("dollar amounts", r"\$[0-9]|\$1,500|\$300|\$")
check("starting at", r"(?i)starting at")
check("price class or priceRange", r"class=\"price\"|priceRange")
check("growth partner", r"(?i)growth partner")
check("Crozet on the public page", r"(?i)crozet")
check("fake customer name", r"(?i)marcus(\s+reed)?")
check("OpsPatch", r"(?i)opspatch")
check("internal staff", r"\b(Alfred|Manor|n8n)\b")
check("banned marketing verbs", r"\b(seamless|elevate|empower|unlock)\b")
check("AI-powered headline", r"AI-powered|AI employee")
check("invented research scores", r"297 businesses")
check("websites as a second offer", r"(?i)sites for local businesses|we still build websites")

need("hello@ email", r"hello@hambrickco.com")
need("phone", r"\(434\) 260-0823")
need("Travis", r"Travis Hambrick")
need("Charlottesville", r"Charlottesville")
need("forty-mile radius", r"forty-mile|40-mile|40 mile")
need("missed-call offer", r"unanswered call|Missed call")
need("estimate follow-up", r"unanswered estimate|dead estimate")
need("illustration label", r"Illustration")
need("one-offer line", r"One offer")

sys.exit(fail)
