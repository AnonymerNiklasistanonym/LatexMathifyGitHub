#!/usr/bin/env bash

mkdir -p dist
git archive --format zip --output dist/source_code.zip main
