#!/bin/sh
# Renders scripts/og.html into the Open Graph share images with headless Chrome.
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for lang in en tr es pt id hi; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --window-size=1200,630 --screenshot="/tmp/linhug-og-$lang.png" "file://$PWD/scripts/og.html#$lang" 2>/dev/null
  sips -s format jpeg -s formatOptions 82 "/tmp/linhug-og-$lang.png" --out "assets/media/og-$lang.jpg" >/dev/null
done
ls -la assets/media/og-*.jpg
