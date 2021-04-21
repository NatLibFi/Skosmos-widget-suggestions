#!/bin/bash 
sudo chmod 777 ../components.js dist/components.js
sudo npm run build
sudo chmod 755 -R dist
cp -p dist/components.js ../
ls -la ../components.js 
