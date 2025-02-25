import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle, FaCube, FaCloudUploadAlt, FaCogs, FaPalette, FaCheck, FaArrowRight, FaHandshake, FaQuoteLeft } from 'react-icons/fa';
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

const testimonials = [
  {
    image: "/benm.jpg",
    quote: "YOOOOOO, everything arrived, so sick. Just passed them out in the office and everyone was so hyped.",
    author: "Ben M.",
    role: "Software Engineer at Vitalize Care",
    project: "Custom Nameplates"
  },
  {
    image: "/dailydriver.jpeg",
    quote: "The quality is outstanding. They helped prototype our product quickly with great attention to detail.",
    author: "Thomas",
    role: "Founder of Daily Driver",
    project: "Custom 3D Printed Keychains"
  },
  {
    image: "/macmini.jpeg",
    quote: "Mandarin 3D helped us prototype a custom Mac Mini enclosure with incredible precision and attention to detail. The final product exceeded our quality standards.",
    author: "Ryan H.",
    role: "Designer at Apple",
    project: "Custom Mac Mini Enclosure"
  }
];

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
      title: "Work with Us",
      description: "Work with us to create your next project, even if you don't have a design!",
      action: "Contact Us",
      link: "/contact"
    },
    {
      icon: <FaHandshake className="w-8 h-8" />,
      title: "Business Solutions",
      description: "Partner with us for your business 3D printing needs",
      action: "Get in Touch",
      link: "/contact"
    }
  ];

  if (localLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <Header />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-grow">
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
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4 px-4">
              Bring Your Ideas to Life
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto px-4">
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

        {/* Testimonials & Showcase Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
              <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                Success Stories
              </span>
            </div>
            <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
              Client Showcases
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              See how we've helped businesses and individuals bring their ideas to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group relative rounded-2xl overflow-hidden bg-[#1a1b1e]/80 border border-neutral-800/50 backdrop-blur-sm hover:border-cyan-500/20 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" /> {/* Grain effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1e] via-transparent opacity-60" />
                  <img
                    src={testimonial.image}
                    alt={testimonial.project}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 relative">
                  <FaQuoteLeft className="text-cyan-500/20 text-4xl absolute top-4 left-4" />
                  <div className="relative">
                    <p className="text-white/80 text-sm leading-relaxed mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="border-t border-neutral-800/50 pt-4">
                      <p className="font-medium text-white">{testimonial.author}</p>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                      <p className="text-xs text-cyan-400 mt-1">{testimonial.project}</p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;