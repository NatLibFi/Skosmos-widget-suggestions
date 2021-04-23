#!/bin/bash 
sudo chown ${USER}:[here your group] dist/components.js
sudo chmod 777 ../components.js dist/components.js
npm run build
sudo chmod 777 -R dist
cp -p dist/components.js ../
ls -la ../components.js 
