rm -rf .xpi_work_dir/

chmod -R 0777 tubestop/
rm -f tubestop.xpi
mkdir .xpi_work_dir
cp -r tubestop/* .xpi_work_dir/
cd .xpi_work_dir/

rm -rf `find . -name ".svn"`
rm -rf `find . -name ".DS_Store"`
rm -rf `find . -name "Thumbs.db"`

cd chrome/
zip -rq ../tubestop.jar *
rm -rf *
mv ../tubestop.jar ./
cd ../
zip -rq ../tubestop.xpi *
cd ..
rm -rf .xpi_work_dir/
cp tubestop.xpi ~/Desktop/
