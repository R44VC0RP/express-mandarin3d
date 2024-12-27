import dotenv from 'dotenv';
dotenv.config({
  'path': '.env.local'
});
import stripePackage from 'stripe';

const free_shipping_rate = "shr_1Q1VOHDBmtvCmuyXi6U0Sb78"

const stripe = stripePackage(process.env.STRIPE_API_KEY);

const dev_stripe = stripePackage(process.env.DEV_STRIPE_API_KEY);

const dev_shipping = "shr_1Q1HviDBmtvCmuyXecoZ1v1Z"

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
    return shippingOptionsArray;
}

export const createSession  = async (checkoutObject, shipping_option_id, cart_id, order_comments, test_mode, pricing_obj) => {
    const stripe_handler = test_mode ? dev_stripe : stripe;
    if (checkoutObject.free_shipping) {
        shipping_option_id = free_shipping_rate;
    }
    shipping_option_id = test_mode ? dev_shipping : shipping_option_id;
    // converting pricing_obj to a string
    const pricing_obj_str = JSON.stringify(pricing_obj);
    const session = await stripe_handler.checkout.sessions.create({
    payment_method_types: ['card'],
    allow_promotion_codes: true,
    line_items: checkoutObject.line_items,
    mode: 'payment',
    automatic_tax: {
      enabled: true
    },
    shipping_address_collection: {
      allowed_countries: ['US']
    },
    shipping_options: [
      {
        shipping_rate: shipping_option_id
      }
    ],
    success_url: `${process.env.BACKEND_URL}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
    metadata: {
      cart_id: cart_id,
      order_comments: order_comments,
      test_mode: test_mode ? true : false,
      visitorId: datafast_visitor_id,
      sessionId: datafast_session_id
    }
  });
    return session;
}

export const getCheckoutSession = async (session_id) => {
  let session;
  try {
    // Try production Stripe first
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch (error) {
    console.log("Failed to retrieve session from production Stripe, trying dev Stripe");
    try {
      // If production fails, try dev Stripe
      session = await dev_stripe.checkout.sessions.retrieve(session_id);
      console.log("Found session in dev Stripe!");
    } catch (devError) {
      console.error("Failed to retrieve session from both production and dev Stripe", devError);
      throw devError;
    }
  }
  return session;
}

export const getPayment = async (payment_id) => {
  let payment;
  try {
    payment = await stripe.paymentIntents.retrieve(payment_id);
  } catch (error) {
    console.log("Failed to retrieve payment from Stripe, trying dev Stripe");
    try {
      payment = await dev_stripe.paymentIntents.retrieve(payment_id);
      console.log("Found payment in dev Stripe!");
    } catch (devError) {
      console.error("Failed to retrieve payment from both production and dev Stripe", devError);
      throw devError;
    }
  }
  return payment;
}