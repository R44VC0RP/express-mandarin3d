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
    },
    file_deletion_date: {
        type: Date,
        required: false,
        default: function() {
            return new Date(this.dateCreated.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
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
    cart_locked: {
        type: Boolean,
        default: false
    },
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
    },
    pricing_obj: {
        type: Object,
        required: false
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
    file_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
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
    password_protected: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: false,
    },
    // ... any other existing fields ...
}, { versionKey: false });

export const orderNumberSchema = new mongoose.Schema({
    lastOrderNumber: {
        type: Number,
        default: 4000 // Starting point for order numbers
    }
}, { versionKey: false });

export const orderSchema = new mongoose.Schema({
    order_id: String,
    order_number: String, // Add this line
    order_comments: String,
    stripe_session_id: String,
    customer_details: {
        address: {
            city: String,
            country: String,
            line1: String,
            line2: String,
            postal_code: String,
            state: String
        },
        email: String,
        name: String
    },
    test_mode: String,
    payment_status: String,
    order_status: {
        type: String,
        enum: ["Reviewing", "In Queue", "Printing", "Completed", "Shipping", "Delivered"],
        default: "Reviewing"
    },
    order_status_options: {
        type: [String],
        default: ["Reviewing", "In Queue", "Printing", "Completed", "Shipping", "Delivered"]
    },
    shipping_details: {
        address: {
            city: String,
            country: String,
            line1: String,
            line2: String,
            postal_code: String,
            state: String
        },
        sendle_reference: String,
        tracking_url: String
    },
    total_details: {
        amount_discount: Number,
        amount_shipping: Number,
        amount_tax: Number,
        amount_subtotal: Number,
        amount_total: Number
    },
    shipping_rate_id: String,
    cart: {
        cart_id: String,
        files: [{
            fileid: String,
            quantity: Number,
            quality: String,
            filament_color: String,
            dimensions: Object,
            stripe_product_id: String,
            filename: String,
            file_status: String,
            utfile_id: String,
            utfile_url: String,
            price_override: Number,
            dateCreated: Date,
            file_deletion_date: Date,
            mass_in_grams: Number,
            file_sale_cost: Number
        }],
        cart_addons: [{
            addon_name: String,
            addon_id: String,
            addon_price: Number
        }],
        dateCreated: Date
    },
    dateCreated: {
        type: Date,
        default: Date.now,

    },
    dateUpdated: {
        type: Date,
        default: Date.now,
        required: false
    },
    shipping_label_url: {
        type: String,
        required: false
    }
}, { versionKey: false });

export const quoteSchema = new mongoose.Schema({
    quote_id: String,
    quote_comments: String,
    quote_files: [{
        fileid: String,
        quantity: Number,
        quality: String,
        filament_color: String,
    }]
});