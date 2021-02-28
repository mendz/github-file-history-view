const fs = require('fs');
const AdmZip = require('adm-zip');
const { logInfo, logSuccess, logFail } = require('./logger');

const zip = new AdmZip();

const path = 'src';
const destZipPath = './build/github-commit-view-file.zip';

function run() {
  if (fs.existsSync(destZipPath)) {
    logInfo(`
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              BUILD CLEANING
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `);
    fs.unlinkSync(destZipPath);
    console.info(`'${destZipPath}' was deleted`);
  }

  logInfo(`
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                ZIPPING...
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `);

  zip.addLocalFolder(path);

  zip.writeZip(destZipPath, () =>
    logSuccess(`
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  DONE!
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  OUTPUT: '${destZipPath}'`)
  );
}
try {
  run();
} catch (error) {
  logFail(`
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 ERROR!
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ${error.stack}`);
}

console.log('');
