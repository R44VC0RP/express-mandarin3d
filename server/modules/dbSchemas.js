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
    product_price: Number,
    product_url: { type: String, required: false },
});

// Config schema
export const configSchema = new mongoose.Schema({
    dimensionConfig: {
        x: Number,
        y: Number,
        z: Number,
    },
    priceConfig: {
        profitMargin: Number
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
});

export const filamentSchema = new mongoose.Schema({
    filament_id: String,
    filament_brand: String,
    filament_name: String,
    filament_color: String,
    filament_unit_price: Number,
    filament_image_url: String,
    filament_mass_in_grams: Number,
    filament_link: String
  });
  

export const addonSchema = new mongoose.Schema({
    addon_id: String,
    addon_name: String,
    addon_price: Number,
    addon_description: String,
});