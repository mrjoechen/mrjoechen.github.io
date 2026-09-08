# MiSans web fonts

MiSans by Xiaomi. These WOFF2 files are Unicode subsets of the official font;
glyph outlines, naming and copyright records are preserved. The union of all
shards retains every character from each original font (verified by the generator).

Source: https://hyperos.mi.com/font-download/MiSans.zip
License: MiSans Font Intellectual Property License Agreement (`LICENSE.pdf`).
Source checksums and character counts: `manifest.json`.

The browser selects shards via `unicode-range` in `src/styles/misans.css`.
English and common punctuation use small Latin shards. Chinese and other scripts
load their corresponding shards on demand; adding articles needs no font rebuild.

## Regenerate (optional; not needed for normal builds)

From the repository root, using an isolated Python environment:

```sh
python3 -m venv .font-venv
.font-venv/bin/pip install 'fonttools[woff]==4.64.0' 'brotli==1.2.0' 'zopfli==0.4.3'
.font-venv/bin/python scripts/subset-misans.py /path/to/MiSans.zip
```

The ZIP is the official download above. Keep it outside the repository.
Normal `npm ci` and `npm run build` use the committed generated font shards.
