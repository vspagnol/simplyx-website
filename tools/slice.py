"""Taglia gli screenshot a pagina intera in parti più piccole, per rivederli. Uso: python3 tools/slice.py cartella nome..."""
import sys
from PIL import Image
S = sys.argv[1]
for n in sys.argv[2:]:
    im = Image.open(S + n + '.png').convert('RGB')
    if im.width > 1500 or (im.width > 500 and im.width < 1300): im = im.resize((390, im.height * 390 // im.width))
    w, h = im.size; step = 2600 if w > 1000 else 1700; i = 0
    for y in range(0, h, step):
        c = im.crop((0, y, w, min(h, y + step)))
        if w > 1000: c = c.resize((w * 2 // 3, c.height * 2 // 3))
        c.save(f'{S}{n}-p{i}.jpg', quality=72); i += 1
    print(n, im.size, i)
