# API Tests

This directory contains tests for the Mandarin3D API endpoints.

## Setup

1. Make sure you have Bun installed:
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Update the test configuration:
   - In `upload.test.js`, update `TEST_STL_URL` to point to a valid STL file URL
   - The test STL file (`test.stl`) is included and represents a simple 1x1x1 cube

## Running Tests

To run all tests:
```bash
bun test
```

To run a specific test file:
```bash
bun test upload.test.js
```

## Test Files

- `upload.test.js`: Tests file upload functionality (both direct file and URL) and monitors processing status
- `test.stl`: A simple 1x1x1 cube STL file used for testing

## Expected Output

The tests will:
1. Upload a file (both direct and URL methods)
2. Check the processing status at:
   - 1 second after upload
   - 5 seconds after upload
   - 10 seconds after upload
3. Log the status at each check
4. Verify the responses match expected formats 