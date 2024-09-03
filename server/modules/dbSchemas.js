import mongoose from 'mongoose';

export const fileSchema = new mongoose.Schema({
    fileid: String,
    stripe_product_id: String,
    filename: String,
    file_status: String,
    file_error: String,
    mass_in_grams: {
        type: Number,
        required: false
    },
    dimensions: {
        x: {
            type: Number,
            required: false
        },
        y: {
            type: Number,
            required: false
        },
        z: {
            type: Number,
            required: false
        }
    },
    utfile_id: String, // UploadThing file id
    utfile_url: String, // UploadThing file url
    stripe_product_id: String, // Stripe product id
    price_override: {
        type: Number,
        required: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    }
});

export const cartSchema = new mongoose.Schema({
    cart_id: String,
    files: [{
        fileid: String,
        quantity: { type: Number, default: 1 },
        quality: { type: String, default: '0.20mm' },
        filament_color: String
    }]
});

export const productSchema = new mongoose.Schema({
    product_id: String,
    product_title: String,
    product_description: String,
    product_features: [String],
    product_image_url: String,
    product_fileid: String,
    product_author: String,
    product_author_url: String,
    product_license: String,
    product_filament_id: String
});

// Config schema
export const configSchema = new mongoose.Schema({
    dimensionConfig: {
        x: Number,
        y: Number,
        z: Number,
    },
    // Add more config sections here
});