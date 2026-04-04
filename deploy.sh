#!/bin/bash
set -e
echo "Building..."
bun run build
echo "Deploying to droplet..."
rsync -av --delete dist/ saadiq@167.71.169.225:/var/www/saadiq.xyz/
echo "Deploying nginx config..."
scp server/ghost-redirects.conf saadiq@167.71.169.225:/tmp/ghost-redirects.conf
ssh saadiq@167.71.169.225 "sudo -n cp /tmp/ghost-redirects.conf /etc/nginx/snippets/ghost-redirects.conf && sudo -n nginx -t && sudo -n nginx -s reload"
echo "Done. Site live at https://saadiq.xyz"
