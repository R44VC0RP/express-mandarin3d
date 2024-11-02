import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductItem from '../components/ProductItem';
import PricingPlan from '../components/ShowcaseProduct';
import Autoplay from "embla-carousel-autoplay"
import Slider from "react-slick";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FileUploadProgress from '../components/FileUploadProgress';
import { useCart } from '../context/Cart';
import Loading from 'react-fullscreen-loading';
import axios from 'axios';
import { toast } from 'sonner';
import BackgroundEffects from '../components/BackgroundEffects'; // Import the new component

// Asset Imports
import prining_bambu from '../assets/videos/printing_bambu.mp4'
import fusion360 from '../assets/images/fusion360.gif'
import building from '../assets/images/outdoor.png'
import custom_cookie_cutters from '../assets/images/custom_cookie_cutters.jpg'
import nameplates from '../assets/images/customnameplates.png'

function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const { cart, deleteFile, addFile } = useCart();
  const [localLoading, setLocalLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const [showcaseProducts, setShowcaseProducts] = useState([]);
  const [files, setFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);


  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);



  const handleAddToCart = async (product_fileid) => {
    console.log("Adding to cart: ", product_fileid);

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
    if (!loading) {
      setLocalLoading(false);
    }
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('code') === 'C01') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
      // remove the parameter from the url
      window.history.replaceState(null, '', location.pathname);
    }
  }, [location]);

  useEffect(() => {
    // This is where you would fetch the showcase products from the server
    // For now, we'll use local data
    const localShowcaseProducts = [
      {
        imageOrVideo: 'video',
        src_file: prining_bambu,
        title: "High Quality Custom 3D Printing",
        description: "We provide an easy way to print high quality custom 3D prints, you just simply have to upload your 3D file* and get an instant quote. By only using BambuLabs 3D printer it allows us to achieve fast print times without compromising on quality or accuracy* on anything you print!",
        footnotes: ["*3D files limited to .stl, .3mf, .step and print bed size limited to 250mm", "*As we try to achieve the best accuracy and print quality prints may differ from 3D file to file"]
      },
      {
        imageOrVideo: 'image',
        src_file: fusion360,
        title: "Custom 3D Modeling and Design",
        description: "We can help you on whatever step of the design process you are on. Still in early development? Talk to one of our designers to get advice on what to improve. Working on modularity? We can make sure it all goes together! We are here to help you accomplish your project!"
      },
      {
        imageOrVideo: 'image',
        src_file: building,
        title: "Architectural Models and Mockups",
        description: "We can help you visualize your project in a way that is not possible with other methods. We can print in high quality filaments and printers that allow for a level of detail that is not possible with other methods."
      },
    ];
    setShowcaseProducts(localShowcaseProducts);

    // In the future, you would replace the above with something like:
    // async function fetchShowcaseProducts() {
    //   try {
    //     const response = await fetch('/api/showcase-products');
    //     const data = await response.json();
    //     setShowcaseProducts(data);
    //   } catch (error) {
    //     console.error('Error fetching showcase products:', error);
    //   }
    // }
    // fetchShowcaseProducts();
  }, []);

  if (localLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
  }

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

  const carouselItems = [
    {
      video_or_image: 'video',
      video_url: prining_bambu,
      title: "Custom 3D Prints Done Right",
      description: "Bringing your ideas to life, one layer at a time.",
      buttons: [
        { text: "See our Model Library", className: "primary-button", onClick: () => {
          window.location.href = "https://shop.mandarin3d.com";
        } },
        { text: "Contact Sales", className: "secondary-button", onClick: () => {
          window.location.href = "/contact";
        } }
      ]
    },
    {
      video_or_image: 'image',
      image: custom_cookie_cutters,
      title: "Custom Cookie Cutters",
      description: "We curate the best designs from the maker community and make them available to you.",
      buttons: [
        { text: "Get your own!", className: "primary-button", onClick: () => {
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
        { text: "Get your own!", className: "primary-button", onClick: () => {
          window.location.href = "https://shop.mandarin3d.com/pages/nameplates";
        } },
      ]
    }
  ];

  console.log(products);



  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      <BackgroundEffects /> {/* Use the new component */}

      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 relative z-10 ">
        {showAlert && (
          <div className="bg-blue-500 text-white p-4 rounded mb-4 flex items-center">
            <FaInfoCircle className="mr-2" />
            You are already logged in.
          </div>
        )}
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row justify-center items-center">
          <Carousel
            className="w-full md:w-[80%] rounded-lg"
            plugins={[
              Autoplay({
                delay: 8000,
              }),
            ]}>
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="w-full relative overflow-hidden  rounded-lg">
                    <div className="relative aspect-[16/9]">
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
                    </div>
                    
                    <div className="md:absolute md:inset-0 flex flex-col justify-end md:p-8">
                    <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 border-2 border-[#5E5E5E] border-opacity-20 rounded-b-lg">
                      <h1 className="text-xl md:text-4xl font-bold mb-2 text-white">{item.title}</h1>
                      <p className="text-sm md:text-xl mb-4 text-white">{item.description}</p>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        {item.buttons.map((button, buttonIndex) => (
                          <button key={buttonIndex} className={`px-4 py-2 rounded ${button.className}`} onClick={button.onClick}>
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
        {/* End Hero Section */}
        {/* Product Showcase Section */}
        <section className="py-8 max-w-screen-lg mx-auto" >
          <h2 className="text-3xl font-bold mb-6">Our Products</h2>
          <div className="md:px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcaseProducts.map((product, index) => (
              <ProductItem key={index} {...product} />
            ))}
          </div>
        </section>

        {/* Pricing Plans Section */}
        {/* <section className="py-8 px-4 max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Featured Products</h2>
          <Slider {...settings}>
            {products.map((plan, index) => (
              <div key={index} className="px-2">
                <PricingPlan {...plan} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </Slider>
        </section> */}
        {/* INSERT SHPOIFY STUFF HERE: */}
      </main>

      {/* Footer */ }
      <div className="relative z-50">
        <Footer />
      </div>
    </div >
  );
}

export default Home;