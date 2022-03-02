#!/usr/bin/env bash

mkdir -p dist

rm -f manifest.json
cp manifest.firefox.json manifest.json
zip -r -FS extension_firefox.zip * \
    --exclude '*.git*' --exclude 'README*' \
    --exclude '*.zip' --exclude '*.sh' \
    --exclude '*test*' --exclude '*delete*' --exclude '*dist*' \
    --exclude '*katex/fonts/*'  --exclude '*katex/auto-render.min.js' \
    --exclude '*icons/icon.svg' \
    --exclude '*manifest.*.json'
cp extension_firefox.zip dist/extension_firefox.zip
rm -rf dist/extension_firefox
unzip dist/extension_firefox.zip -d dist/extension_firefox
rm manifest.json

rm -f manifest.json
cp manifest.chromium.json manifest.json
zip -r -FS extension_chromium.zip * \
    --exclude '*.git*' --exclude 'README*' \
    --exclude '*.zip' --exclude '*.sh' \
    --exclude '*test*' --exclude '*delete*' --exclude '*dist*' \
    --exclude '*katex/fonts/*' --exclude '*katex/auto-render.min.js' \
    --exclude '*icons/icon.svg' \
    --exclude '*manifest.*.json'
cp extension_chromium.zip dist/extension_chromium.zip
rm -rf dist/extension_chromium
unzip dist/extension_chromium.zip -d dist/extension_chromium
rm manifest.json
