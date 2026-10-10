"""Regenerate with: python -m pip install 'fonttools[woff]'; python scripts/optimize-advertorial-font.py"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
source = root / 'advertorial-app/fonts/noto-sans-arabic.ttf'
font = TTFont(source)
# The UI uses normal width exclusively; preserve the complete variable weight range.
optimized = instantiateVariableFont(font, {'wdth': 100}, inplace=False)
optimized.flavor = 'woff2'
optimized.save(source.with_suffix('.woff2'))
