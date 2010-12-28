rm -rf build
mkdir build
cp -r tubestop-chrome build/
cd build
rm -rf `find . -name ".git"`
rm -rf `find . -name ".DS_Store"`
rm ~/Desktop/tubestop-chrome.zip
cd tubestop-chrome
zip -rq ~/Desktop/tubestop-chrome.zip *
cd ../../
rm -rf build