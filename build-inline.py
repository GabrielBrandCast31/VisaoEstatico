#!/usr/bin/env python3
"""Injeta o CSS compilado (assets/css/tailwind.build.css) inline no <head> de
cada página, dentro de <style id="visao-css">…</style>.

Isso elimina o request de CSS que bloqueia a renderização (melhora FCP/LCP no
mobile). Rode SEMPRE depois de recompilar o Tailwind:

    npx tailwindcss@3.4.15 -c tailwind.config.cjs -i input.css \\
        -o assets/css/tailwind.build.css --minify
    python3 build-inline.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
css = (ROOT / "assets/css/tailwind.build.css").read_text()
assert "</style>" not in css, "CSS contém </style> — abortando"

pattern = re.compile(r'<style id="visao-css">.*?</style>', re.DOTALL)
replacement = '<style id="visao-css">' + css + "</style>"

for f in ["index.html", "quiz.html", "obrigado.html", "politica-privacidade.html"]:
    p = ROOT / f
    s = p.read_text()
    new, n = pattern.subn(replacement, s)
    if n != 1:
        raise SystemExit(f"{f}: esperava 1 placeholder, achei {n}")
    p.write_text(new)
    print(f"{f}: CSS inline ({len(css)} bytes)")
