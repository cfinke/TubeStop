mkdir .tmp
curl -o ".locales.zip" "http://interpr.it/api/download?extension_id=3"
mv .locales.zip .tmp/
cd .tmp/
unzip .locales.zip
rm .locales.zip
cp -r * ../tubestop-chrome/_locales/
cd ..
rm -rf .tmp/
