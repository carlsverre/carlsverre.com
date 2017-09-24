#!/usr/bin/env bash

set -e

REMOTE=proto
ROOT=/srv/www-carlsverre-com

echo "Updating wall drawing 91"
( cd art/wall_drawing_91 && npm run build )
ssh ${REMOTE} "mkdir -p ${ROOT}/art/wall_drawing_91"
scp -r art/wall_drawing_91/{index.html,assets} ${REMOTE}:${ROOT}/art/wall_drawing_91

echo "Updating colorful hexagons"
( cd art/hexagon_colors && npm run build )
ssh ${REMOTE} "mkdir -p ${ROOT}/art/hexagon_colors"
scp -r art/hexagon_colors/{index.html,assets} ${REMOTE}:${ROOT}/art/hexagon_colors

echo "Updating worldspin"
( cd art/worldspin && npm run build )
ssh ${REMOTE} "mkdir -p ${ROOT}/art/worldspin"
scp -r art/worldspin/build/* ${REMOTE}:${ROOT}/art/worldspin

echo "Updating main assets"
scp -r index.html assets ${REMOTE}:${ROOT}
