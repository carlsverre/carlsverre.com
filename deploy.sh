#!/usr/bin/env bash

set -e

echo "Updating wall drawing 91"
( cd art/wall_drawing_91 && npm run build )
ssh ralph "mkdir -p static/www-carlsverre-com/art/wall_drawing_91"
scp -r art/wall_drawing_91/{index.html,assets} ralph:static/www-carlsverre-com/art/wall_drawing_91

echo "Updating colorful hexagons"
( cd art/hexagon_colors && npm run build )
ssh ralph "mkdir -p static/www-carlsverre-com/art/hexagon_colors"
scp -r art/hexagon_colors/{index.html,assets} ralph:static/www-carlsverre-com/art/hexagon_colors

echo "Updating main assets"
scp -r index.html assets ralph:static/www-carlsverre-com
