#!/usr/bin/env bash
# Convert all JPG/PNG images under warm/images/ to WebP.
# Requires: imagemagick (magick, IMv7+)
# Usage: bash compress-images.sh [--quality 82] [--dry-run]

set -euo pipefail

QUALITY=82
DRY_RUN=false
INPUT_DIR="warm/images"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --quality) QUALITY="$2"; shift 2 ;;
        --dry-run) DRY_RUN=true; shift ;;
        *) echo "Unknown arg: $1"; exit 1 ;;
    esac
done

if ! command -v magick &>/dev/null; then
    echo "ERROR: imagemagick not found. Install: sudo pacman -S imagemagick"
    exit 1
fi

echo "Quality: $QUALITY  Dry-run: $DRY_RUN  Source: $INPUT_DIR"

find "$INPUT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r src; do
    dst="${src%.*}.webp"
    size_before=$(du -k "$src" | cut -f1)

    if [[ "$DRY_RUN" == true ]]; then
        echo "WOULD convert: $src -> $dst"
        continue
    fi

    magick "$src" \
        -auto-level \
        -modulate 100,110,100 \
        -quality "$QUALITY" \
        "$dst"

    size_after=$(du -k "$dst" | cut -f1)
    pct=$(( (size_before - size_after) * 100 / size_before ))
    echo "OK  $src -> $dst  (${size_before}K -> ${size_after}K, -${pct}%)"
done

echo "Done."
