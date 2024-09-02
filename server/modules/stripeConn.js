import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_API_KEY);

export const createNewProduct = async (file_name, file_id, file_image = "https://cdn.discordapp.com/attachments/1165771547223543990/1279816538295107625/3d_model.jpg?ex=66d5d188&is=66d48008&hm=409c22a2b80eaee0ef74c55020ea84511efd9d050f5acd948180d1ae13ac89ce&") => {
    const product = await stripe.products.create({
        name: file_name || "Untitled",
        images: [file_image],
        metadata: {
            file_id: file_id,
        },
    });
    return product;
}

export const deleteProduct = async (product_id) => {
    await stripe.products.del(product_id);
}


