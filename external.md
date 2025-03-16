# External Provider using M3D

## Overview

## API Routes

Primary URL: `https://backend.mandarin3d.com`

### POST /api/submit-remote

Upload a 3D model file for processing.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes* | The 3D model file to upload (STL, OBJ, etc.) |
| file_url | String | Yes* | URL to a 3D model file (alternative to direct upload) |
| external_source | String | No | Source identifier for the upload (default: "remote-submit") |

*Either `file` or `file_url` must be provided

#### Response (Success)

```json
{
  "message": "File uploaded successfully",
  "url": "https://mandarin3d.com/file/1234567890",
  "fileid": "1234567890",
  "status": "slicing" // <- this will always be "slicing", as the processing is done in the backend asynchronously, you will have to query the status of the file to see when it is done (see below)
    }
```

#### Response (Error)

```json
{
  "status": "error",
  "error": "No file or file URL provided"
}
```


### GET /api/file-query

Query the status and details of previously uploaded files.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fileids | String | Yes | Comma-separated list of file IDs to query |

#### Response (Success - All Files Processed)

```json
{
  "file123": {
    "mass": 25.6,
    "dimensions": {
      "x": 50.2,
      "y": 30.5,
      "z": 20.8,
      "units": "mm"
    },
    "pricing": {
      "decent_quality": {
        "layer_height": 0.20,
        "price": 12.50,
        "currency": "USD"
      },
      "best_quality": {
        "layer_height": 0.16,
        "price": 15.75,
        "currency": "USD"
      }
    }
  },
  "file456": {
    "mass": 18.2,
    "dimensions": {
      "x": 40.1,
      "y": 25.3,
      "z": 15.7,
      "units": "mm"
    },
    "pricing": {
      "decent_quality": {
        "layer_height": 0.20,
        "price": 8.99,
        "currency": "USD"
      },
      "best_quality": {
        "layer_height": 0.16,
        "price": 11.25,
        "currency": "USD"
      }
    }
  }
}
```

#### Response (Files Still Processing)

```json
{
  "status": "slicing",
  "message": "All files are still being sliced",
  "details": {
    "file123": {
      "status": "slicing",
      "message": "File is still being sliced"
    },
    "file456": {
      "status": "slicing",
      "message": "File is still being sliced"
    }
  }
}
```

#### Response (Files With Errors)

```json
{
  "status": "error",
  "message": "All files had errors",
  "details": {
    "file123": {
      "status": "error",
      "message": "Error processing file"
    },
    "file456": {
      "status": "error",
      "message": "File not found"
    }
  }
}
```

#### Response (Mixed Status)

If some files are processed and others are still slicing or have errors, the response will include a mix of results without a top-level status:

```json
{
  "file123": {
    "mass": 25.6,
    "dimensions": {
      "x": 50.2,
      "y": 30.5,
      "z": 20.8,
      "units": "mm"
    },
    "pricing": {
      "decent_quality": {
        "layer_height": 0.20,
        "price": 12.50,
        "currency": "USD"
      },
      "best_quality": {
        "layer_height": 0.16,
        "price": 15.75,
        "currency": "USD"
      }
    }
  },
  "file456": {
    "status": "slicing",
    "message": "File is still being sliced"
  },
  "file789": {
    "status": "error",
    "message": "File not found"
  }
}
```

### POST /api/quote/create

Create a new quote with multiple 3D model files.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| quote_files | Array | Yes | Array of file IDs to include in the quote |
| organization_name | String | Yes | Name of the organization creating the quote |

#### Response (Success)

```json
{
  "status": "success",
  "message": "Quote created successfully",
  "quote": {
    "quote_id": "quote_1234567890abcdef",
    "quote_comments": "Public quote created by Acme Corp",
    "quote_files": ["file123", "file456"]
  }
}
```

#### Response (Error)

```json
{
  "status": "error",
  "message": "Failed to create quote"
}
```


