import dotenv from 'dotenv';
import stripePackage from 'stripe';

// Load environment variables from .env file
dotenv.config({ 'path': '.env.local' });

const stripe = stripePackage(process.env.STRIPE_API_KEY);

const createNewProduct = async (file_name, file_id, file_image = "https://utfs.io/f/db9c501f-28aa-4ff5-b4cd-33f86bf1b09a-9w6i5v.png") => {
    const product = await stripe.products.create({
        name: file_name,
        images: [file_image],
        metadata: {
            file_id: file_id,
        },
    });
    return product;
}

const deleteProduct = async (product_id) => {
    await stripe.products.del(product_id);
}

export default { createNewProduct, deleteProduct };