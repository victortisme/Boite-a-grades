#!/usr/bin/env python3
"""Assemble index.html (fichier unique, comme Boîte à mots) à partir de src/."""
from pathlib import Path
s = Path(__file__).parent / 'src'
r = lambda n: (s / n).read_text(encoding='utf-8')
html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#0b2545">
<title>Boîte à grades</title>
<style>
{r('base.css')}{r('extra.css')}</style>
</head>
<body>

{r('body.html')}

<script>
{r('data.js')}
{r('chest.js')}
{r('sync.js')}
{r('app.js')}</script>
</body>
</html>
'''
(Path(__file__).parent / 'index.html').write_text(html, encoding='utf-8')
print('index.html', len(html))
