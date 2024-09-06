import dotenv from 'dotenv';
dotenv.config({
  'path': '.env.local'
});
import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_API_KEY);

export const createNewStripeProduct = async (file_name, file_id, file_image = "https://cdn.discordapp.com/attachments/1165771547223543990/1279816538295107625/3d_model.jpg?ex=66d5d188&is=66d48008&hm=409c22a2b80eaee0ef74c55020ea84511efd9d050f5acd948180d1ae13ac89ce&") => {
    const product = await stripe.products.create({
        name: file_name || "Untitled",
        images: [file_image],
        metadata: {
            file_id: file_id,
        },
    });
    return product;
}

export const deleteStripeProduct = async (product_id) => {
    await stripe.products.del(product_id);
}

export const createNewShippingOption = async (name, price, delivery_estimate="4-5", notes="") => {
    price = Math.round(price * 100);
    delivery_estimate = delivery_estimate.split("-");
    const shippingRate = await stripe.shippingRates.create({
        display_name: name,
        type: 'fixed_amount',
        fixed_amount: {
          amount: price,
          currency: 'usd',
        },
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: delivery_estimate[0],
          },
          maximum: {
            unit: 'business_day',
            value: delivery_estimate[1],
          },
        },
        metadata: {
            express: true
        },
    });
    return shippingRate.id;
}

export const deleteShippingOption = async (shipping_option_id) => {
    await stripe.shippingRates.update(
        shipping_option_id,
        {
            active: false,
        }
    )
    return true;
}

export const getShippingOptions = async () => {
    const shippingOptions = await stripe.shippingRates.list({
        active: true,

    });
    let shippingOptionsArray = [];
    for (const shippingOption of shippingOptions.data) {
        if (shippingOption.metadata.express) {
            shippingOptionsArray.push(shippingOption);
        }
    }
    console.log(shippingOptionsArray);
    return shippingOptionsArray;
}