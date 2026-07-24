#!/usr/bin/env python3
"""Expand OfflinePackManifest with content roles + sha256 (design §6.2)."""
from __future__ import annotations

import json
from hashlib import sha256
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"
CONTENT = ROOT / "content"


def file_meta(abs_path: Path, web_path: str, role: str) -> dict:
    data = abs_path.read_bytes()
    return {
        "path": web_path,
        "role": role,
        "bytes": len(data),
        "sha256": sha256(data).hexdigest(),
    }


def main() -> None:
    # Chalisa pack — embed content JSON copies under public/content for offline
    chalisa_pub = PUBLIC / "content" / "texts" / "hanuman-chalisa"
    src = CONTENT / "texts" / "hanuman-chalisa"
    chalisa_pub.mkdir(parents=True, exist_ok=True)
    for name, role in [
        ("meta.json", "meta"),
        ("structure.json", "structure"),
        ("verses.json", "verses"),
        ("translations/hi.json", "translation"),
        ("translations/en.json", "translation"),
        ("transliteration/iast.json", "transliteration"),
    ]:
        s = src / name
        d = chalisa_pub / name
        d.parent.mkdir(parents=True, exist_ok=True)
        d.write_bytes(s.read_bytes())

    assets = [
        file_meta(
            PUBLIC / "audio/chalisa/hanuman_chalisa.m4a",
            "/audio/chalisa/hanuman_chalisa.m4a",
            "audio",
        ),
        file_meta(
            PUBLIC / "audio/chalisa/hanuman_chalisa_cues.json",
            "/audio/chalisa/hanuman_chalisa_cues.json",
            "cues",
        ),
    ]
    for name, role, locale, scheme in [
        ("meta.json", "meta", None, None),
        ("structure.json", "structure", None, None),
        ("verses.json", "verses", None, None),
        ("translations/hi.json", "translation", "hi", None),
        ("translations/en.json", "translation", "en", None),
        ("transliteration/iast.json", "transliteration", None, "iast"),
    ]:
        abs_p = chalisa_pub / name
        web = f"/content/texts/hanuman-chalisa/{name}"
        a = file_meta(abs_p, web, role)
        if locale:
            a["locale"] = locale
        if scheme:
            a["scheme"] = scheme
        assets.append(a)

    pack = {
        "id": "pack-chalisa-v1",
        "textId": "hanuman-chalisa",
        "version": 2,
        "title": {"hi": "चालीसा ऑफ़लाइन", "en": "Chalisa offline"},
        "maxBytes": 26214400,
        "locales": ["hi", "en"],
        "transliterationSchemes": ["iast"],
        "segmentIds": ["chalisa-full"],
        "cueMapIds": ["hanuman_chalisa_cues"],
        "trackId": "track-hanuman_chalisa",
        "assets": assets,
        "createdAt": "2026-07-22T00:00:00Z",
        "notes": "Full OfflinePackManifest roles: audio, cues, meta, structure, verses, translations, iast",
    }
    out = CONTENT / "packs" / "pack-chalisa-v1.json"
    out.write_text(json.dumps(pack, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # mirror for web data
    (ROOT / "apps/web/src/data/pack-chalisa-v1.json").write_text(
        json.dumps(pack, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("enriched pack-chalisa-v1", len(assets), "assets")

    # re-hash SK packs only audio/cues (already have sha)
    sk_path = CONTENT / "packs" / "sk-section-packs.json"
    sk = json.loads(sk_path.read_text(encoding="utf-8"))
    for p in sk["packs"]:
        new_assets = []
        for a in p["assets"]:
            rel = a["path"].lstrip("/")
            f = PUBLIC / rel
            if f.exists():
                new_assets.append(file_meta(f, a["path"], a.get("role", "audio")))
            else:
                new_assets.append(a)
        p["assets"] = new_assets
        p["locales"] = p.get("locales") or ["hi", "en"]
        p["transliterationSchemes"] = p.get("transliterationSchemes") or ["iast"]
    sk_path.write_text(json.dumps(sk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("enriched sk packs", len(sk["packs"]))


if __name__ == "__main__":
    main()
