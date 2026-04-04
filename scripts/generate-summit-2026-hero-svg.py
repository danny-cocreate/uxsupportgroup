#!/usr/bin/env python3
"""Generate public/summit-2026-hero.svg — matrix-style hero (replace with final art if needed)."""
import random

W, H = 1920, 640
random.seed(42)
cols, rows = 72, 22
cell_w, cell_h = W / cols, H / rows
palette = ["#22c55e", "#4ade80", "#34d399", "#2dd4bf", "#22d3ee", "#38bdf8", "#67e8f9", "#86efac"]

parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" preserveAspectRatio="xMidYMid slice">',
    '<defs>',
    '<radialGradient id="b1" cx="20%" cy="30%" r="35%"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.35"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>',
    '<radialGradient id="b2" cx="78%" cy="55%" r="40%"><stop offset="0%" stop-color="#22d3ee" stop-opacity="0.3"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>',
    '<radialGradient id="b3" cx="50%" cy="80%" r="30%"><stop offset="0%" stop-color="#4ade80" stop-opacity="0.25"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>',
    '</defs>',
    f'<rect width="{W}" height="{H}" fill="#030306"/>',
    '<rect width="100%" height="100%" fill="url(#b1)"/>',
    '<rect width="100%" height="100%" fill="url(#b2)"/>',
    '<rect width="100%" height="100%" fill="url(#b3)"/>',
]

for r in range(rows):
    for c in range(cols):
        x = c * cell_w + cell_w * 0.5
        y = r * cell_h + cell_h * 0.55
        d = random.randint(0, 9)
        color = random.choice(palette)
        op = 0.25 + random.random() * 0.45
        parts.append(
            f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="middle" font-family="ui-monospace,monospace" '
            f'font-size="{min(cell_w, cell_h) * 0.62:.1f}" font-weight="600" fill="{color}" fill-opacity="{op:.2f}">{d}</text>'
        )

# Title block (approximate layout from reference)
parts += [
    '<g transform="translate(960,300)">',
    # AIXUX SUMMIT
    '<text x="-520" y="40" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="72" font-weight="800" fill="#ffffff">AI</text>',
    '<text x="-395" y="40" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="72" font-weight="800" fill="#fbbf24">X</text>',
    '<text x="-330" y="40" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="72" font-weight="800" fill="#ffffff">UX SUMMIT</text>',
    # 2026 outlined
    '<text x="180" y="55" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="96" font-weight="800" fill="none" stroke="#ffffff" stroke-width="3">2026</text>',
    '</g>',
    '</svg>',
]

out = "/workspace/public/summit-2026-hero.svg"
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(parts))
print("Wrote", out)
