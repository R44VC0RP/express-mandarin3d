# API Documentation

## Overview

This document provides detailed information about the Mandarin3D API endpoints, authentication methods, request/response formats, and error handling.

## Base URL

All API requests should be made to the following base URL:

```
https://backend.mandarin3d.com/
```

## Authentication

### API Key Authentication

Most API endpoints require an API key for authentication. Include your API key in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

## Rate Limiting

API requests are limited to 100 requests per minute per API key. If you exceed this limit, you will receive a 429 Too Many Requests response.

## Endpoints

### File Handling

#### Upload File

```
POST /api/submit-remote
```

Uploads a file to the Mandarin3D platform for processing. Accepts either a direct file upload or a URL to a file.

**Request Body:**

| Parameter        | Type   | Required | Description                           |
|-----------------|--------|----------|---------------------------------------|
| file            | file   | No*      | The file to upload (STL ONLY)         |
| file_url        | string | No*      | URL of the file to upload             |
| external_source | string | No       | Your upload identifier (pick a name) (required) |

*Either `file` or `file_url` must be provided

**Example Requests:**

File Upload:
```bash
curl -X POST "https://backend.mandarin3d.com/api/submit-remote" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/file.stl" \
  -F "external_source=your_upload_identifier"
```

URL Upload:
```bash
curl -X POST "https://backend.mandarin3d.com/api/submit-remote" \
  -H "Content-Type: application/json" \
  -d '{
    "file_url": "https://example.com/path/to/file.stl",
    "external_source": "your_upload_identifier"
  }'
```

**JavaScript Example:**
```javascript
// File upload
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('external_source', 'your_upload_identifier');
  try {
    const response = await fetch('https://backend.mandarin3d.com/api/submit-remote', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// URL upload
async function uploadFileFromUrl(fileUrl) {
  try {
    const response = await fetch('https://backend.mandarin3d.com/api/submit-remote', {
      method: 'POST',
      body: JSON.stringify({
        file_url: fileUrl,
        external_source: 'your_upload_identifier'
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file from URL:', error);
    throw error;
  }
}

// Usage examples:
// File upload:
// const fileInput = document.querySelector('input[type="file"]');
// const file = fileInput.files[0];
// uploadFile(file).then(response => console.log(response));

// URL upload:
// uploadFileFromUrl('https://example.com/path/to/file.stl')
//   .then(response => console.log(response));
```

**Example Success Response:**

```json
{
  "message": "File uploaded successfully",
  "url": "https://mandarin3d.com/file/abcdef123456",
  "fileid": "abcdef123456",
  "status": "slicing"
}
```

**Example Error Response:**

```json
{
  "status": "error",
  "message": "No file or file URL provided"
}
```

#### Query File Details

```
GET /api/file-query
```

Retrieves detailed information about one or more files, including mass, dimensions, and pricing at different quality levels.

**Query Parameters:**

| Parameter | Type            | Required | Description                           |
|-----------|----------------|----------|---------------------------------------|
| fileids   | string/array   | Yes      | Single fileid or array of fileids     |

**Example Requests:**

Single File:
```bash
curl -X GET "https://backend.mandarin3d.com/api/file-query?fileids=abcdef123456"
```

Multiple Files:
```bash
curl -X GET "https://backend.mandarin3d.com/api/file-query?fileids=abcdef123456,ghijkl789012"
```

**JavaScript Example:**
```javascript
// Query single file
async function queryFile(fileId) {
  try {
    const response = await fetch(`https://backend.mandarin3d.com/api/file-query?fileids=${fileId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error querying file:', error);
    throw error;
  }
}

// Query multiple files
async function queryFiles(fileIds) {
  try {
    const fileIdsString = Array.isArray(fileIds) ? fileIds.join(',') : fileIds;
    const response = await fetch(`https://backend.mandarin3d.com/api/file-query?fileids=${fileIdsString}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error querying files:', error);
    throw error;
  }
}

// Usage examples:
// Single file query:
// queryFile('abcdef123456').then(response => console.log(response));

// Multiple files query:
// queryFiles(['abcdef123456', 'ghijkl789012']).then(response => console.log(response));
```

**Example Success Response:**

Single File:
```json
{
  "abcdef123456": {
    "mass": 125.7,
    "dimensions": {
      "x": 100,
      "y": 150,
      "z": 75,
      "units": "mm"
    },
    "pricing": {
      "decent_quality": {
        "layer_height": 0.20,
        "price": 25.50,
        "currency": "USD"
      },
      "best_quality": {
        "layer_height": 0.16,
        "price": 32.75,
        "currency": "USD"
      }
    }
  }
}
```

Multiple Files:
```json
{
  "abcdef123456": {
    "mass": 125.7,
    "dimensions": {
      "x": 100,
      "y": 150,
      "z": 75,
      "units": "mm"
    },
    "pricing": {
      "decent_quality": {
        "layer_height": 0.20,
        "price": 25.50,
        "currency": "USD"
      },
      "best_quality": {
        "layer_height": 0.16,
        "price": 32.75,
        "currency": "USD"
      }
    }
  },
  "ghijkl789012": {
    "mass": 85.3,
    "dimensions": {
      "x": 80,
      "y": 120,
      "z": 60,
      "units": "mm"
    },
    "pricing": {
      "decent_quality": {
        "layer_height": 0.20,
        "price": 18.25,
        "currency": "USD"
      },
      "best_quality": {
        "layer_height": 0.16,
        "price": 23.50,
        "currency": "USD"
      }
    }
  }
}
```

**Example Error Response:**

```json
{
  "status": "error",
  "message": "Invalid fileid(s) provided"
}
```

**Example File Not Sliced Response:**

```json
{
  "status": "slicing",
  "message": "File is still being sliced"
}
```
