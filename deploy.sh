#!/bin/bash
set -e
echo "Building..."
bun run build
echo "Deploying to droplet..."
scp -r dist/* root@167.71.169.225:/var/www/saadiq.xyz/
echo "Done. Site live at https://saadiq.xyz"
