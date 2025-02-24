import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle, FaCube, FaCloudUploadAlt, FaCogs, FaPalette, FaCheck, FaArrowRight } from 'react-icons/fa';
import ProductItem from '../components/ProductItem';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCart } from '../context/Cart';
import Loading from 'react-fullscreen-loading';
import axios from 'axios';
import { toast } from 'sonner';

// Asset Imports
import prining_bambu from '../assets/videos/printing_bambu.mp4';
import fusion360 from '../assets/images/fusion360.gif';
import building from '../assets/images/outdoor.png';
import custom_cookie_cutters from '../assets/images/custom_cookie_cutters.jpg';
import nameplates from '../assets/images/customnameplates.png';

export const metadata = {
  title: 'Mandarin 3D | Custom 3D Prints & Models',
  description: 'Mandarin 3D is a custom 3D printing and modeling service that specializes in creating high-quality 3D models for a wide range of applications.',
  openGraph: {
    type: 'website'
  }
};

function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const { cart, addFile } = useCart();
  const [localLoading, setLocalLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const [showcaseProducts, setShowcaseProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product_fileid) => {
    try {
      const result = await addFile(product_fileid);
      if (result.status === 'success') {
        toast.success('File added to cart successfully');
      } else {
        toast.error(result.message || 'Failed to add file to cart');
      }
    } catch (error) {
      console.error('Error adding file to cart:', error);
      toast.error('An error occurred while adding the file to cart');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product?action=list`);
      if (response.data.status === 'success') {
        setProducts(response.data.result);
      } else {
        toast.error('Failed to fetch products. Please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching products.');
    }
  };

  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('code') === 'C01') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      window.history.replaceState(null, '', location.pathname);
    }
  }, [location]);

  const carouselItems = [
    {
      video_or_image: 'video',
      video_url: prining_bambu,
      title: "Custom 3D Prints Done Right",
      description: "Bringing your ideas to life, one layer at a time.",
      buttons: [
        { text: "Start Your Project", className: "bg-[#0D939B] hover:bg-[#0B7F86] text-white transition-colors duration-300", onClick: () => {
          window.location.href = "/upload";
        } },
        { text: "Browse Models", className: "border border-[#0D939B] text-[#0D939B] hover:bg-[#0D939B] hover:text-white transition-colors duration-300", onClick: () => {
          window.location.href = "https://shop.mandarin3d.com";
        } }
      ]
    },
    {
      video_or_image: 'image',
      image: custom_cookie_cutters,
      title: "Custom Cookie Cutters",
      description: "We curate the best designs from the maker community and make them available to you.",
      buttons: [
        { text: "Design Your Cutter", className: "bg-[#0D939B] hover:bg-[#0B7F86] text-white transition-colors duration-300", onClick: () => {
          window.location.href = "https://shop.mandarin3d.com/pages/cookie-cutters";
        } },
      ]
    },
    {
      video_or_image: 'image',
      image: nameplates,
      title: "Custom Nameplates and Plaques",
      description: "Stand out with a custom nameplate or plaque. Perfect for gifts, awards, or personalization.",
      buttons: [
        { text: "Create Your Design", className: "bg-[#0D939B] hover:bg-[#0B7F86] text-white transition-colors duration-300", onClick: () => {
          window.location.href = "https://shop.mandarin3d.com/pages/nameplates";
        } },
      ]
    }
  ];

  const features = [
    {
      icon: <FaCube className="w-8 h-8" />,
      title: "Ready-to-Print Models",
      description: "Browse our curated collection of pre-designed models",
      action: "Browse Models",
      link: "https://shop.mandarin3d.com"
    },
    {
      icon: <FaCloudUploadAlt className="w-8 h-8" />,
      title: "Custom Uploads",
      description: "Upload your designs for professional printing",
      action: "Upload Now",
      link: "/upload"
    },
    {
      icon: <FaCogs className="w-8 h-8" />,
      title: "Advanced Technology",
      description: "State-of-the-art printers and materials",
      action: "Learn More",
      link: "/about"
    },
    {
      icon: <FaPalette className="w-8 h-8" />,
      title: "Custom Finishing",
      description: "Professional painting and finishing services",
      action: "See Options",
      link: "/services"
    }
  ];

  if (localLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white relative">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <Header />
      </div>

      {/* Main content */}
      <main className="relative z-10">
        {showAlert && (
          <div className="bg-blue-500 text-white p-4 rounded mb-4 flex items-center">
            <FaInfoCircle className="mr-2" />
            You are already logged in.
          </div>
        )}

        {/* Quick Action Banner */}
        <div className="bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-cyan-500/20 border-y border-cyan-500/20">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div>
                <h3 className="text-xl font-semibold">Ready to bring your ideas to life?</h3>
                <p className="text-gray-400">Get started with our instant quote system</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/upload'}
              className="px-6 py-3 bg-[#0D939B] hover:bg-[#0B7F86] text-white rounded-full transition-all duration-300 flex items-center group"
            >
              Start Your Project
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <Carousel
            className="w-full rounded-2xl overflow-hidden shadow-2xl"
            plugins={[
              Autoplay({
                delay: 8000,
              }),
            ]}>
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative aspect-[21/9]">
                      {item.video_or_image === 'video' ? (
                        <video
                          src={item.video_url}
                          className="object-cover w-full h-full"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">{item.title}</h1>
                        <p className="text-base md:text-lg mb-6 text-gray-200 drop-shadow">{item.description}</p>
                        <div className="flex flex-wrap gap-4">
                          {item.buttons.map((button, buttonIndex) => (
                            <button
                              key={buttonIndex}
                              className={`px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-cyan-500/20 ${button.className}`}
                              onClick={button.onClick}
                            >
                              {button.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
              <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                Features
              </span>
            </div>
            <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
              Bring Your Ideas to Life
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Advanced 3D printing solutions for every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="relative h-full flex flex-col items-center p-8 rounded-[20px] bg-gradient-to-b from-[#0A0A0B] to-[#141415] border border-[#2A2B2E] group-hover:border-cyan-500/20 transition-all duration-500 shadow-lg hover:shadow-cyan-500/10">
                  <div className="relative mb-8">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-cyan-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
                    <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-xl bg-[#0A0A0B] border border-[#2A2B2E] group-hover:border-cyan-500/20">
                      <div className="text-cyan-500 transform group-hover:scale-110 transition-transform duration-500">
                        {feature.icon}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 text-center">
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-500 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#8F9099] group-hover:text-white/70 transition-colors duration-500 mb-4">
                      {feature.description}
                    </p>
                    <button
                      onClick={() => window.location.href = feature.link}
                      className="px-4 py-2 text-sm text-cyan-500 hover:text-white border border-cyan-500 rounded-full hover:bg-cyan-500 transition-all duration-300 flex items-center mx-auto group"
                    >
                      {feature.action}
                      <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1E1F22] border border-[#2A2B2E]">
              <span className="text-xs font-medium tracking-wide text-[#8F9099] uppercase">
                Our Products
              </span>
            </div>
            <h2 className="mt-8 text-[56px] font-bold text-white leading-tight">
              Featured Solutions
            </h2>
            <p className="mt-4 text-lg text-[#8F9099] max-w-2xl mx-auto">
              Discover our range of professional 3D printing services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseProducts.map((product, index) => (
              <ProductItem key={index} {...product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;