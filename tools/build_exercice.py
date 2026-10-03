#!/usr/bin/env python3
"""
Génère l'image chiffrée + les tests de l'exercice.

Usage :  python3 tools/build_exercice.py chemin/vers/image.png

Principe : la clé de chiffrement est dérivée des *résultats* de la bonne
solution sur les jeux de tests. Le site ne contient ni la solution, ni les
résultats attendus en clair (seulement leurs empreintes SHA-256), ni l'image
en clair : seul quelqu'un dont le code produit les bons résultats peut
déchiffrer l'image.

⚠ À relancer si tu modifies SOLUTION / TESTS ci-dessous.
⚠ Ne laisse pas l'image d'origine dans le dépôt public.
"""
import base64, hashlib, json, os, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

# --- À personnaliser -------------------------------------------------------
def SOLUTION(nombres):          # solution de référence (jamais publiée)
    return sum(n for n in nombres if n % 2 == 0)

TESTS = [[1, 2, 3, 4], [10, 15, 20], [], [7, 9], [-2, -4, 5], [100, 1, 1, 2]]
ITERATIONS = 200_000
# ---------------------------------------------------------------------------

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "exercice")

def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()

def main(image_path):
    results = [str(SOLUTION(list(t))) for t in TESTS]
    secret = "|".join(results)                      # = ce que le JS recalcule
    salt, iv = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(hashes.SHA256(), 32, salt, ITERATIONS).derive(secret.encode())
    data = open(image_path, "rb").read()
    ext = os.path.splitext(image_path)[1].lower().lstrip(".")
    mime = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
            "gif": "image/gif", "webp": "image/webp"}[ext]
    ct = AESGCM(key).encrypt(iv, data, None)
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, "image.enc"), "wb").write(ct)
    meta = {
        "mime": mime, "iterations": ITERATIONS,
        "salt": base64.b64encode(salt).decode(), "iv": base64.b64encode(iv).decode(),
        "tests": [{"args": t, "hash": sha256_hex(r)} for t, r in zip(TESTS, results)],
    }
    json.dump(meta, open(os.path.join(OUT, "meta.json"), "w"), indent=2)
    print(f"OK : {len(ct)} octets chiffrés, {len(TESTS)} tests")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
