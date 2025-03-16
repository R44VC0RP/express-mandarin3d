# Mandarin 3D API Test Scripts

This package contains test scripts for testing various Mandarin 3D API endpoints.

## Setup

1. Make sure you have Node.js installed (v14 or higher recommended)
2. Install dependencies:

```bash
mv test-package.json package.json
npm install
```

3. Update the test data:
   - Replace placeholder IDs with valid IDs from your database
   - For `/api/direct-charge`, you need:
     - A valid Stripe customer ID with a saved payment method
     - Valid file IDs
     - Valid filament IDs

## Getting a Test STL File

For testing the `/api/submit-remote` endpoint, you'll need an STL file. 
You can use the provided helper script to download a sample STL file:

```bash
node download-test-stl.js
```

This will download a sample STL file (Utah teapot) and save it as `teststl.stl` in the current directory.

## Testing with a Local Server

Make sure your server is running locally before running the tests.

## Available Tests

### Test All Endpoints

```bash
npm test
```

### Test Direct Charge Endpoint

```bash
npm run test:direct-charge
```

### Test File Query Endpoint

```bash
npm run test:file-query
```

### Test Submit Remote Endpoint

```bash
npm run test:submit-remote
```

## Using Your Own STL Files

If you want to use your own STL file for testing:

1. Place your STL file in the same directory as the test script
2. Rename it to `teststl.stl` or update the `filePath` in the `testSubmitRemote` function to point to your file

## Troubleshooting

- If you get 404 errors, make sure the server is running and the API endpoints are correct
- If you get validation errors, check the console output for details on what went wrong 