#!/usr/bin/env bash

KATEX_VERSION="0.15.2"
BASE_URL="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist"
KATEX_LOCAL_DIR="katex"
KATEX_FILES=(
    katex.min.js
    katex.min.css
)
KATEX_CONTRIB_FILES=(
    auto-render.min.js
)

KATEX_FONTS_BASE_URL="https://github.com/KaTeX/katex-fonts/tree/master/fonts"
KATEX_FONTS_LOCAL_DIR="${KATEX_LOCAL_DIR}/fonts"
KATEX_FONTS=(
    KaTeX_AMS-Regular.woff2
    KaTeX_Caligraphic-Bold.woff2
    KaTeX_Caligraphic-Regular.woff2
    KaTeX_Fraktur-Bold.woff2
    KaTeX_Fraktur-Regular.woff2
    KaTeX_Main-Bold.woff2
    KaTeX_Main-Italic.woff2
    KaTeX_Main-Regular.woff2
    KaTeX_Math-BoldItalic.woff2
    KaTeX_Math-Italic.woff2
    KaTeX_Math-Regular.woff2
    KaTeX_SansSerif-Bold.woff2
    KaTeX_SansSerif-Italic.woff2
    KaTeX_SansSerif-Regular.woff2
    KaTeX_Script-Regular.woff2
    KaTeX_Size1-Regular.woff2
    KaTeX_Size2-Regular.woff2
    KaTeX_Size3-Regular.woff2
    KaTeX_Size4-Regular.woff2
    KaTeX_Typewriter-Regular.woff2
)

# Clean up previously downloaded files
rm -rf "${KATEX_LOCAL_DIR}"

mkdir -p "${KATEX_LOCAL_DIR}"
# Download the KaTeX CSS and JS file
LICENSE_LIST_KATEX_FILES=""
for KATEX_FILE in "${KATEX_FILES[@]}"; do
    wget -O "${KATEX_LOCAL_DIR}/${KATEX_FILE}" "${BASE_URL}/${KATEX_FILE}"
    LICENSE_LIST_KATEX_FILES="${LICENSE_LIST_KATEX_FILES}${KATEX_FILE}, "
done
# Download the KaTeX contrib files (auto renderer)
for KATEX_CONTRIB_FILE in "${KATEX_CONTRIB_FILES[@]}"; do
    wget -O "${KATEX_LOCAL_DIR}/${KATEX_CONTRIB_FILE}" "${BASE_URL}/contrib/${KATEX_CONTRIB_FILE}"
    LICENSE_LIST_KATEX_FILES="${LICENSE_LIST_KATEX_FILES}${KATEX_CONTRIB_FILE}, "
done

mkdir -p "${KATEX_FONTS_LOCAL_DIR}"
# Download fonts used by KaTeX
LICENSE_LIST_KATEX_FONT_FILES=""
for KATEX_FONT in "${KATEX_FONTS[@]}"; do
    wget -O "${KATEX_FONTS_LOCAL_DIR}/${KATEX_FONT}" "${KATEX_FONTS_BASE_URL}/${KATEX_FONT}"
    LICENSE_LIST_KATEX_FONT_FILES="${LICENSE_LIST_KATEX_FONT_FILES}${KATEX_FONT}, "
done

echo "The files ${LICENSE_LIST_KATEX_FILES::-2} are taken from \"${BASE_URL}\" and are used under the terms of the MIT license: https://github.com/KaTeX/KaTeX/blob/master/LICENSE.

The files ${LICENSE_LIST_KATEX_FONT_FILES::-2} are taken from \"${KATEX_FONTS_BASE_URL}\" and are used under the terms of the MIT license: https://github.com/KaTeX/KaTeX/blob/master/LICENSE." > "${KATEX_LOCAL_DIR}/LICENSE"
