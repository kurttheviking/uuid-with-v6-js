#!/bin/bash

set -e

rm -Rf dist &>/dev/null
npx tsc
CONTENT=$(cat dist/uuidgen.js)
(
  echo "#!/usr/bin/env node"
  echo "$CONTENT"
) > dist/uuidgen.js

chmod +x dist/uuidgen.js


