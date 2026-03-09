#!/bin/bash
set -e
echo "Building..."
bun run build
echo "Deploying to droplet..."
rsync -av --delete dist/ root@167.71.169.225:/var/www/saadiq.xyz/
echo "Deploying nginx config..."
scp server/ghost-redirects.conf root@167.71.169.225:/etc/nginx/snippets/ghost-redirects.conf
ssh root@167.71.169.225 "nginx -t && nginx -s reload"
echo "Done. Site live at https://saadiq.xyz"
