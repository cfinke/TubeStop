rm -rf .xpi_work_dir/

chmod -R 0777 tubestop/
rm ~/Desktop/tubestop-latest.xpi
mkdir .xpi_work_dir
cp -r tubestop/* .xpi_work_dir/
cd .xpi_work_dir/

rm -rf `find . -name ".git"`
rm -rf `find . -name ".DS_Store"`
rm -rf `find . -name "Thumbs.db"`

zip -rq ~/Desktop/tubestop-latest.xpi *
cd ..
rm -rf .xpi_work_dir/