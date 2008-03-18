rm -rf `find ./ -name ".DS_Store"`
rm -rf `find ./ -name "Thumbs.db"`
rm tubestop.xpi
rm -rf .tmp_xpi_dir/

chmod -R 0777 tubestop/

mkdir .tmp_xpi_dir/
cp -r tubestop/* .tmp_xpi_dir/

cd .tmp_xpi_dir/chrome/
zip -rq ../tubestop.jar *
rm -rf *
mv ../tubestop.jar ./
cd ../
zip -rq ../tubestop.xpi *
cd ../
rm -rf .tmp_xpi_dir/
