import dotenv from 'dotenv';
dotenv.config({
  'path': '.env.local'
});
import {
    createNewProduct,
    deleteProduct
} from './stripeConn.js';
import {
    UTApi
} from "uploadthing/server";


const utapi = new UTApi();

export const reSliceFile = async (fileid) => {
    const file = await File.findOne({
        fileid
    });
    if (!file) {
        return null;
    }
    file.file_status = "unsliced";
    await file.save();
    sliceFile(fileid);
    return {
        "status": "success",
        "message": "File resliced successfully"
    };
}


export const sliceFile = async (fileid) => {
    const file = await File.findOne({
        fileid
    });
    if (!file) {
        return null;
    }
    const sliceResponse = await fetch('https://api.mandarin3d.com/v2/api/slice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "fileid": fileid,
            "env": process.env.NODE_ENV
        })
    });
    return {
        "status": "success",
        "message": "File sliced successfully"
    };
}

export const createNewFile = async (filename, utfile_id, utfile_url, price_override = null) => {
    const fileid = "file_" + uuidv4();
    const stripeProduct = await createNewProduct(filename, fileid, utfile_id, utfile_url);
    const newFile = new File({
        fileid,
        stripe_product_id: stripeProduct.id,
        utfile_id,
        utfile_url,
        filename,
        price_override,
        file_status: "unsliced"
    });
    await newFile.save();
    // Post to https://api.mandarin3d.com/v2/api/slice
    console.log("Posting to https://api.mandarin3d.com/v2/api/slice");
    sliceFile(fileid);
    return newFile;
}

export const deleteFile = async (fileid) => {
    // this requires a user to be an admin
    const file = await File.findOne({
        fileid
    });
    if (!file) {
        return null;
    }
    const stripeid = file.stripe_product_id;
    const utid = file.utfile_id;
    await File.deleteOne({
        fileid
    });
    await deleteProduct(stripeid);
    await utapi.deleteFiles(utid); // Delete the file from UploadThing
    return file;
}

export const getFile = async (fileid) => {
    const file = await File.findOne({
        fileid
    });
    return file;
}

export const getAllFiles = async () => {
    const files = await File.find();
    return files;
}