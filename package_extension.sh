#!/usr/bin/env bash

zip -r -FS extension.zip * --exclude '*.git*' --exclude 'README*' --exclude '*.zip' --exclude '*.sh'
