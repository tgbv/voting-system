#!/bin/bash

# build assets only if they aren't already
if [ ! -e "/app/dist" ]; then
  npm run build --prefix="/app"
fi

npm run serve@prod --prefix="/app"