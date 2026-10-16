import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

const distDir = path.resolve(process.cwd(), 'dist');
const outputZip = path.resolve(process.cwd(), 'coins-production-build.zip');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist! Please run npm run build first.');
  process.exit(1);
}

const zip = new AdmZip();
zip.addLocalFolder(distDir);
zip.writeZip(outputZip);
console.log(`Successfully created zip at ${outputZip}`);
