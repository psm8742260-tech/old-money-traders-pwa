const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const distDir = path.resolve(__dirname, 'dist');
const outputZip = path.resolve(__dirname, 'coins-production-build.zip');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist!');
  process.exit(1);
}

const zip = new AdmZip();
zip.addLocalFolder(distDir);
zip.writeZip(outputZip);
console.log('SUCCESS: coins-production-build.zip created.');
