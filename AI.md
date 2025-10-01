# 80x15 Brilliant Button Maker – AI Work Summary

## Goals
- Recreate classic 80x15 “brilliant buttons” in-browser with pixel-perfect fidelity to the original PHP/GD implementation (Luca Zappa / Bill Zeller).
- Ensure visuals match the reference (outer black/gray border, inner white border, vertical white divider, Silkscreen text) at 1x/2x/4x.

## Key Changes

### Rendering pipeline
- Switched to HTML5 Canvas with a Silkscreen bitmap sprite (pure black + transparent) for text, identical character widths to original.
- Colorized glyphs via compositing (`source-in`) to avoid fringe/halo pixels.
- Disabled smoothing everywhere; used `alpha:false` contexts to prevent semi‑transparent artifacts.
- Replaced stroke-based borders with `fillRect` draws to guarantee crisp 1‑pixel edges:
  - Outer border: `fillRect(0,0,80,15)` with `#666666`.
  - Inner border: `fillRect(1,1,78,13)` with `#FFFFFF`.
  - Vertical divider: `fillRect(bar,1,1,12)` with `#FFFFFF`.

### Font sprites
- Generated Silkscreen font sprites at 8pt/16pt/24pt using ImageMagick `+antialias` and Python (Pillow) with cleanup to maintain only two colors (black, transparent).
- Final sprite lives at `silkscreen-font-sprites/font.png`.

### Text rendering
- Implemented `FONT_MAP` with original per-character widths; render by copying sub-rects from the sprite.
- Added automatic centering for left-box text: compute pixel width from `FONT_MAP` and place at `x = 2 + floor((barPosition - 2 - textWidth)/2)`; y fixed at 5 to match original.

### Export
- On download, render to an RGB canvas (no alpha) and export PNG to eliminate any residual transparency.
- Provided 1x/2x/4x canvases (80x15, 160x30, 320x60) with identical pixel layout.

### Defaults & UI
- Updated defaults to classic style:
  - Left: text `#FFFFFF`, background `#FF6600`.
  - Right: text `#FFFFFF`, background `#888880`.
- Kept inputs in sync (color pickers + hex fields) and added cache-busting for JS (`?v=2`).

## Verification
- Pixel-level comparisons performed with ImageMagick and Pillow scripts.
- Fixed issues found:
  - Anti-aliased borders → replaced strokes with fills.
  - Alpha in exports → RGB-only export canvas.
  - Black text fringes → compositing colorization and pure two-color font sprite.
  - Centering offset → automatic center computation using measured text width.

## Files of Interest
- `index.html` – UI and defaults.
- `style.css` – pixelated rendering and layout.
- `button-maker.js` – complete rendering pipeline, compositing, export, auto-centering.
- `silkscreen-font-sprites/font.png` – Silkscreen glyph sprite (8pt line layout matching original map).

## Next Improvements (optional)
- Auto-centering for right text based on right-box width.
- Optional left/right icons (11px tall) as in the original tool.
- Presets and shareable URLs.
