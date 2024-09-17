import mongoose from 'mongoose';

export const fileSchema = new mongoose.Schema({
    fileid: String,
    stripe_product_id: String,
    filename: String,
    file_status: String, // 'unsliced', 'success', 'error'
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
}, { versionKey: false });

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
}, { versionKey: false });

export const cartSchema = new mongoose.Schema({
    cart_id: String,
    files: [{
        fileid: String,
        quantity: { type: Number, default: 1 },
        quality: { type: String, default: '0.20mm' },
        filament_color: { type: String, default: 'Black PLA' }
    }],
    cart_addons: [{
        addon_name: String,
        addon_id: String,
        addon_price: Number
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

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
    product_price: Number,
    product_url: { type: String, required: false },
    product_tags: [String],
    product_collection: { type: String, required: false }
}, { versionKey: false });

// Config schema
export const configSchema = new mongoose.Schema({
    dimensionConfig: {
        x: Number,
        y: Number,
        z: Number,
    },
    priceConfig: {
        profitMargin: Number,
        freeShippingThreshold: Number // Add this line
    },
    stripeConfig: {
        shippingOptions: [{
            stripe_id: String,
            name: String,
            price: Number,
            delivery_estimate: String,
            notes: String
        }]
    }
}, { versionKey: false });

export const filamentSchema = new mongoose.Schema({
    filament_id: String,
    filament_brand: String,
    filament_name: String,
    filament_color: String,
    filament_unit_price: Number,
    filament_image_url: String,
    filament_mass_in_grams: Number,
    filament_link: String
}, { versionKey: false });

export const addonSchema = new mongoose.Schema({
    addon_id: String,
    addon_name: String,
    addon_price: Number,
    addon_description: String,
}, { versionKey: false });

// Add a new schema for collections
export const collectionSchema = new mongoose.Schema({
    collection_id: String,
    collection_name: String,
    collection_description: String,
    collection_image_url: String,
    featured: {
        type: Boolean,
        default: false,
    },
    // ... any other existing fields ...
}, { versionKey: false });