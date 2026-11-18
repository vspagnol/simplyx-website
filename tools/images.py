"""Prepara le foto del sito: da assets-src/*.png a static/img/photos/*.webp (due larghezze) + immagine social.
Uso: python3 tools/images.py   (richiede Pillow; i risultati sono versionati, la build non ne ha bisogno)."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT, LABS = ROOT / "assets-src", ROOT / "static/img/photos", ROOT / "static/img/labs"
OUT.mkdir(parents=True, exist_ok=True); LABS.mkdir(parents=True, exist_ok=True)

for f in sorted(SRC.glob("*.png")):
    im = Image.open(f).convert("RGB")
    for w in (1536, 800):
        r = im if im.width == w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(OUT / f"{f.stem}-{w}.webp", "WEBP", quality=80 if w == 1536 else 76, method=6)
    print(f.stem, im.size)

labs = ROOT / "design/campione-homepage/img"
for n in ("bellaria", "bellaria-mock", "advoca", "invest", "curaria", "melo"):
    im = Image.open(labs / f"{n}.jpg").convert("RGB")
    im.thumbnail((1200, 1200), Image.LANCZOS)
    im.save(LABS / f"{n}.webp", "WEBP", quality=80, method=6)
    print("labs", n, im.size)

# immagine per i social (1200x630) dalla foto di copertina
hero = Image.open(SRC / "hero.png").convert("RGB")
h = round(hero.width * 630 / 1200)
top = (hero.height - h) // 2
hero.crop((0, top, hero.width, top + h)).resize((1200, 630), Image.LANCZOS).save(ROOT / "static/img/og-image.jpg", "JPEG", quality=86, optimize=True)
