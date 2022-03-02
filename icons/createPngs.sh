#!/usr/bin/env bash

inkscape --export-width=48 --export-height=48 --export-type=png --export-filename="icon.png" "icon.svg"
inkscape --export-width=96 --export-height=96 --export-type=png --export-filename="icon@2x.png" "icon.svg"
