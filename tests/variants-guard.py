#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1] / "variants"
pages = list(root.rglob("*.html")) + list(root.rglob("*.js"))
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


need("gallery hub", r"01-recovery-signal")
need("five variant folders", r"05-metallic-diagnostic")
check("dollar amounts", r"\$[0-9]|\$1,500|starting at")
check("growth partner", r"(?i)growth partner")
check("Crozet", r"(?i)crozet")
check("OpsPatch", r"(?i)opspatch")
check("banned verbs", r"\b(seamless|elevate|empower|unlock)\b")
check("invented score", r"297 businesses")
need("hello@ email", r"hello@hambrickco.com")
need("phone", r"\(434\) 260-0823")
need("illustration label", r"Illustration")
need("reduced-motion kill", r"prefers-reduced-motion")
need("no fake send", r"Nothing is sent from this page")

sys.exit(fail)
