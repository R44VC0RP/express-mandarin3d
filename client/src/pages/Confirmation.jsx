import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Loading from 'react-fullscreen-loading';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import ShowcaseProduct from '../components/ShowcaseProduct';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DeliveryStatus from '@/components/admin/comp_LinearDeliveryStatus';

function OrderConfirmation() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  

  // const statusOrder = ["Designing", "In Queue", "Printing", "Shipped", "Delivered"]

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.status === 'success') {
        setOrderData(response.data.order);
      } else {
        toast.error('Failed to fetch order details.');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('An error occurred while fetching order details.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product?action=list`);
      if (response.data.status === 'success') {
        setProducts(response.data.result);
        console.log("Products: ", response.data.result);
      } else {
        console.error('Error fetching products:', response.data.message);
        toast.error('Failed to fetch products. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('An error occurred while fetching products. Please try again later.');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchProducts();
  }, [fetchOrderDetails]);

  if (loading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <p className="text-white">Order not found.</p>
      </div>
    );
  }
  console.log("Order Data: ", orderData);
  const { order_number, customer_details, payment_status, cart, shipping_details, total_details } = orderData;
  const { files, cart_addons } = cart;

  const subtotal = files.reduce((acc, file) => acc + (file.file_sale_cost || 0) * file.quantity, 0);
  const addonsTotal = cart_addons.reduce((acc, addon) => acc + addon.addon_price / 100, 0);
  let items_total = subtotal + addonsTotal;
  const shipping = orderData.total_details.amount_shipping / 100;
  const tax = orderData.total_details.amount_tax / 100;
  const total = items_total + shipping + tax;

  const statusOrder = orderData.order_status_options;
  const deliveries = [{
    status: orderData.order_status,
    date: new Date(orderData.dateUpdated).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
  }];
    // const deliveries = [
    //   { status: "Printing", date: "13 Sep" },
    // ] // this is just a placeholder for now

  const handleAddToCart = async (product_fileid) => {
    console.log("Adding to cart: ", product_fileid);
    // Implement the add to cart functionality here
    toast.success('File added to cart successfully');
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Header />
      <div className="mt-3 w-full border-t border-b border-[#5E5E5E] bg-[#2A2A2A]">
        <div className="flex items-center justify-left mt-2">
          <Link to="/" className="ml-4 my-4 inline-block"><FaArrowLeft /></Link>
          <p className="ml-2 text-3xl font-bold">Order Confirmation</p>
        </div>
        <div className="flex items-center justify-left mb-4">
          <p className="ml-4 mr-4 inline-block text-sm font-light">
            <Link to="/" className="text-white">Home</Link> / <span className="text-white font-bold">Order Confirmation</span>
          </p>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 w-[90vw] max-w-7xl">
          <div className="col-span-2 mt-4 lg:mt-4">
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-6">
              <h1 className="text-3xl font-bold mb-4">Thanks {customer_details.name}!</h1>
              <h2 className="text-xl font-bold mb-6">Your order has been placed!</h2>
              <div className="hidden md:flex items-center justify-center p-4 py-5 bg-[#2A2A2A] rounded-lg">
                <DeliveryStatus deliveries={deliveries} statusOrder={statusOrder}  />
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              <p className="mb-2"><span className="font-semibold">Order Number:</span> {order_number}</p>
              <p className="mb-2"><span className="font-semibold">Payment Status:</span> <Badge>{payment_status.charAt(0).toUpperCase() + payment_status.slice(1)}</Badge></p>
              
              <h3 className="text-xl font-semibold mt-6 mb-2">Items Purchased</h3>
              {files.map((file) => (
                <div key={file.fileid} className="flex justify-between items-center mb-4 pb-4 border-b border-[#2A2A2A]">
                  <div>
                    <p className="font-semibold">{file.filename}</p>
                    <p className="text-sm text-[#8A8A8A]">Quantity: {file.quantity}</p>
                    <p className="text-sm text-[#8A8A8A]">Quality: {file.quality}</p>
                    <p className="text-sm text-[#8A8A8A]">Color: {file.filament_color}</p>
                  </div>
                  <p className="font-bold">${file.file_sale_cost ? file.file_sale_cost.toFixed(2) : '0.00'}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 lg:-mt-8">
            <div className="card-special w-full p-4 -mt-8">
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center mb-2">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="font-semibold">Payment Success!</span>
                </div>
                <p className="text-4xl font-bold">${total.toFixed(2)}</p>
              </div>

              <hr className="border-t border-[#5E5E5E] my-4" />
              {files.map(file => (
                <div key={file.fileid} className="flex justify-between mb-2">
                  <p className="font-light">{file.filename} x {file.quantity}</p>
                  <p className="font-bold">${(file.file_sale_cost * file.quantity).toFixed(2)}</p>
                </div>
              ))}
              {cart_addons.map(addon => (
                <div key={addon.addon_id} className="flex justify-between mb-2">
                  <p className="font-light">{addon.addon_name}</p>
                  <p className="font-bold">${(addon.addon_price / 100).toFixed(2)}</p>
                </div>
              ))}
              <hr className="border-t border-[#5E5E5E] my-4" />
              <div className="flex justify-between mb-4">
                <p className="font-light">Shipping:</p>
                <p className="font-bold">${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="font-light">Tax:</p>
                <p className="font-bold">${tax.toFixed(2)}</p>
              </div>
              <hr className="border-t border-[#5E5E5E] my-4" />
              <div className="flex justify-between mb-4">
                <p className="font-light">Total:</p>
                <p className="font-bold">${total.toFixed(2)}</p>
              </div>
            </div>
            <div className="card-special w-full p-4 mt-4">
              <h3 className="text-xl font-semibold mb-2">Shipping Information</h3>
              <p>{customer_details.name}</p>
              <p>{shipping_details.address.line1}</p>
              {shipping_details.address.line2 && <p>{shipping_details.address.line2}</p>}
              <p>{shipping_details.address.city}, {shipping_details.address.state} {shipping_details.address.postal_code}</p>
              <p>{shipping_details.address.country}</p>
            </div>
          </div>
        </div>
        {/* Featured Products Section */}
        <section className="py-8 px-4">
          <h2 className="text-3xl font-bold mb-6">Our Featured Products</h2>
          <Slider {...settings}>
            {products.map((product, index) => (
              <div key={index} className="px-2">
                <ShowcaseProduct {...product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </Slider>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OrderConfirmation;