#!/usr/bin/env python3
"""
Génère assets/exercice/meta.json : les arguments des tests + l'empreinte SHA-256
du résultat attendu (la page peut dire ✅/❌ sans contenir les réponses en clair).

Usage :  python3 tools/build_exercice.py
À relancer si tu modifies TESTS ou SOLUTION.
"""
import hashlib, json, os

def SOLUTION(texte):                 # solution de référence (jamais publiée)
    return texte[::-1]

TESTS = [                            # un seul argument (une chaîne) par test
    "!!issuér sa ut",
    "62549619d8edd5c5=is?vv2q89CeR6x1uozxQANxh5/tsilyalp/moc.yfitops.nepo//:sptth : simorp emmoc",
]

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "exercice")
os.makedirs(OUT, exist_ok=True)
meta = {"tests": [{"args": t, "hash": hashlib.sha256(str(SOLUTION(t)).encode()).hexdigest()} for t in TESTS]}
json.dump(meta, open(os.path.join(OUT, "meta.json"), "w"), indent=2, ensure_ascii=False)
print(f"OK : {len(TESTS)} tests")
for t in TESTS: print("  attendu :", SOLUTION(t))
