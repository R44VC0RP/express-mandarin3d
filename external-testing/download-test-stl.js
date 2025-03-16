// download-test-stl.js - Downloads a sample STL file for testing
const fs = require('fs');
const https = require('https');
const path = require('path');

const SAMPLE_STL_URL = 'https://upload.wikimedia.org/wikipedia/commons/5/51/Utah_teapot_(solid).stl';
const OUTPUT_FILE = path.join(process.cwd(), 'teststl.stl');

console.log('📥 Downloading sample STL file...');

const file = fs.createWriteStream(OUTPUT_FILE);

https.get(SAMPLE_STL_URL, response => {
  const totalSize = parseInt(response.headers['content-length'], 10);
  let downloadedSize = 0;
  
  response.pipe(file);
  
  response.on('data', chunk => {
    downloadedSize += chunk.length;
    const percentage = Math.round((downloadedSize / totalSize) * 100);
    process.stdout.write(`\r💾 Downloaded: ${percentage}%`);
  });
  
  file.on('finish', () => {
    file.close();
    console.log('\n✅ Sample STL file downloaded successfully!');
    console.log(`📁 File saved to: ${OUTPUT_FILE}`);
    console.log('🔍 You can now run the submit-remote test.');
  });
}).on('error', err => {
  fs.unlink(OUTPUT_FILE); 
  console.error(`\n❌ Error downloading file: ${err.message}`);
}); 