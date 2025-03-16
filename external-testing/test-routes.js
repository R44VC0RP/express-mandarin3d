// Mandarin 3D API endpoints
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://backend.mandarin3d.com'; // Change to your server URL

// Axios instance with authorization header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to handle API responses
const handleResponse = (response, endpointName) => {
  console.log(`\n✅ ${endpointName} Response:`);
  console.log(JSON.stringify(response.data, null, 2));
  return response.data;
};

// Helper function to handle errors
const handleError = (error, endpointName) => {
  console.error(`\n❌ Error in ${endpointName}:`);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`Status: ${error.response.status}`);
    console.error('Response data:', error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('Error:', error.message);
  }
};

// Test 1: /api/submit-remote endpoint
async function testSubmitRemote() {
  console.log('\n🧪 Testing /api/submit-remote endpoint...');
  
  try {
    const form = new FormData();
    
    // Using the local teststl.stl file
    const filePath = path.join(process.cwd(), 'teststl.stl');
    console.log(`📁 Using STL file at: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found: teststl.stl');
      return;
    }
    
    // Read the file and append it to form data
    const fileBuffer = fs.readFileSync(filePath);
    console.log(`📊 File size: ${fileBuffer.length} bytes`);
    
    // Append the file with the correct field name that the server expects
    form.append('file', fileBuffer, {
      filename: 'teststl.stl',
      contentType: 'application/sla',
    });
    
    form.append('external_source', 'api-test');
    
    console.log('📤 Uploading file...');
    const response = await axios.post(`${API_URL}/api/submit-remote`, form, {
      headers: {
        ...form.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    return handleResponse(response, '/api/submit-remote');
  } catch (error) {
    handleError(error, '/api/submit-remote');
  }
}

// Test 2: /api/file-query endpoint
async function testFileQuery() {
  console.log('\n🧪 Testing /api/file-query endpoint...');
  
  try {
    // Replace with actual file IDs from your database
    const fileIds = ['file_123', 'file_456']; 
    
    const response = await api.get(`/api/file-query?fileids=${fileIds.join(',')}`);
    return handleResponse(response, '/api/file-query');
  } catch (error) {
    handleError(error, '/api/file-query');
  }
}

// Test 3: /api/direct-charge endpoint
async function testDirectCharge() {
  console.log('\n🧪 Testing /api/direct-charge endpoint...');
  
  try {
    // Example payload - replace with valid data for your system
    const payload = {
      stripe_customer_id: 'cus_RwE1lKT51nHbNn', // THIS IS YOUR (AMY ZHOU) STRIPE CUSTOMER ID DO NOT CHANGE IT AND THIS WILL CHARGE YOUR CREDIT CARD
      files: [
        {
          fileid: 'file_123', // This is the file id of the file you want to print
          filament_id: 'filament_123', // This is the filament id of the filament you want to use (make sure it relates to the /api/filament route)
          quantity: 1,
          quality: '0.20mm'
        }
      ],
      customer_details: {
        name: 'Test Customer', // <--- This is the name of the customer you want to charge
        email: 'test@example.com', // <--- This is the email of the customer you want to charge
        address: {
          line1: '123 Test St', // <--- This is the address of the customer you want to charge
          city: 'Test City', // <--- This is the city of the customer you want to charge
          state: 'TS', // <--- This is the state of the customer you want to charge
          postal_code: '12345', // <--- This is the postal code of the customer you want to charge
          country: 'US' // <--- This is the country of the customer you want to charge
        }
      },
      order_comments: 'Test order from API' // <--- This is the comments of the order you want to charge
    };
    
    const response = await api.post('/api/direct-charge', payload);
    return handleResponse(response, '/api/direct-charge');
  } catch (error) {
    handleError(error, '/api/direct-charge');
  }
}

// Test 4: /api/filament endpoint (list filaments)
async function testFilamentList() {
  console.log('\n🧪 Testing /api/filament list endpoint...');
  
  try {
    const response = await api.get('/api/filament?action=list');
    return handleResponse(response, '/api/filament list');
  } catch (error) {
    handleError(error, '/api/filament list');
  }
}

// Run a specific test by passing the test name as an argument
// e.g., node test-routes.js direct-charge
async function main() {
  const testArg = process.argv[2]?.toLowerCase();
  
  console.log('🚀 M3D API Test Script');
  console.log('===========================================');
  
  switch (testArg) {
    case 'submit-remote':
      await testSubmitRemote();
      break;
    case 'file-query':
      await testFileQuery();
      break;
    case 'direct-charge':
      await testDirectCharge();
      break;
    case 'filament-list':
      await testFilamentList();
      break;
    default:
      console.log('Running all tests sequentially...');
      // Uncomment tests you want to run
      await testSubmitRemote();
      await testFileQuery();
      await testDirectCharge();
      await testFilamentList();
  }
  
  console.log('\n===========================================');
  console.log('🏁 Test script completed');
}

main().catch(console.error);

/*
 * HOW TO USE:
 * -----------
 * 1. Make sure your server is running
 * 2. Update the test data with valid IDs for your system
 * 3. Run a specific test:
 *    node test-routes.js submit-remote
 *    node test-routes.js file-query
 *    node test-routes.js direct-charge
 *    node test-routes.js filament-list
 * 4. Or run all tests:
 *    node test-routes.js
 */ 