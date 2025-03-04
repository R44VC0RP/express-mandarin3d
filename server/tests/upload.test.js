import { test, expect } from "bun:test";
import { readFileSync } from 'fs';
import { join } from 'path';

const API_URL = 'http://localhost:8080';
const TEST_STL_PATH = join(__dirname, 'next_gen_puffer.stl'); // You'll need to add a test STL file
const TEST_STL_URL = 'https://0o4pg1fpby.ufs.sh/f/RSbfEU0J8DcdJyjGBY53YcMCbI7gKOhHekyato51XAsQxF68'; // Replace with a real STL URL

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check file status
async function checkFileStatus(fileid) {
  const response = await fetch(`${API_URL}/api/file-query?fileids=${fileid}`);
  const data = await response.json();
  return data[fileid];
}

test("file upload and status check", async () => {
  // Read test STL file
  const fileBuffer = readFileSync(TEST_STL_PATH);
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: 'application/sla' }), TEST_STL_PATH);
  formData.append('external_source', 'single-file-upload');

  // Upload file
  const uploadResponse = await fetch(`${API_URL}/api/submit-remote`, {
    method: 'POST',
    body: formData
  });

  const uploadData = await uploadResponse.json();
  expect(uploadResponse.status).toBe(200);
  expect(uploadData.fileid).toBeDefined();

  const fileid = uploadData.fileid;
  console.log(`File uploaded with ID: ${fileid}`);

  // Check status after 1 second
  await sleep(1000);
  const status1 = await checkFileStatus(fileid);
  console.log('Status after 1 second:', status1);
  expect(status1).toBeDefined();

  // Check status after 5 seconds
  await sleep(4000); // 4 more seconds (total 5)
  const status5 = await checkFileStatus(fileid);
  console.log('Status after 5 seconds:', status5);
  expect(status5).toBeDefined();

  // Check status after 10 seconds
  await sleep(5000); // 5 more seconds (total 10)
  const status10 = await checkFileStatus(fileid);
  console.log('Status after 10 seconds:', status10);
  expect(status10).toBeDefined();
});

test("URL upload and status check", async () => {
  // Upload file from URL
  const uploadResponse = await fetch(`${API_URL}/api/submit-remote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file_url: TEST_STL_URL,
      external_source: 'test-url-upload'
    })
  });

  const uploadData = await uploadResponse.json();
  expect(uploadResponse.status).toBe(200);
  expect(uploadData.fileid).toBeDefined();

  const fileid = uploadData.fileid;
  console.log(`File uploaded from URL with ID: ${fileid}`);

  // Check status after 1 second
  await sleep(1000);
  const status1 = await checkFileStatus(fileid);
  console.log('Status after 1 second:', status1);
  expect(status1).toBeDefined();

  // Check status after 5 seconds
  await sleep(4000); // 4 more seconds (total 5)
  const status5 = await checkFileStatus(fileid);
  console.log('Status after 5 seconds:', status5);
  expect(status5).toBeDefined();

  // Check status after 10 seconds
  await sleep(5000); // 5 more seconds (total 10)
  const status10 = await checkFileStatus(fileid);
  console.log('Status after 10 seconds:', status10);
  expect(status10).toBeDefined();
}); 