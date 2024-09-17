import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle } from 'react-icons/fa';
import ProductItem from '../components/ProductItem';
import PricingPlan from '../components/ShowcaseProduct';
import Slider from 'react-slick';
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

  const productShowcases = [
    {
      title: "Shark Knife",
      description: "A knife in the shape of a shark that is inspired by pictures i found on pinterest",
      price: 5.43, // This will be generated by the pricing algorithm later.
      features: ["DIY Project", "Fan Favorite"],
      image: "https://utfs.io/f/e10a593b-1a30-429a-adc6-e5abe19bc194-wq6ive.webp",
      fileid: "file_cadf356c-973b-4794-9d27-db426bba9ea1",
      author: "FileForge",
      author_url: "https://makerworld.com/en/@FileForge",
      license: "CC BY-SA 4.0"
    },
    {
      title: "Spongebob Sponge Holder",
      description: "A sponge holder in the shape of a spongebob squarepants character",
      price: 2.76,
      features: ["DIY Project", "Fan Favorite"],
      image: "https://utfs.io/f/930bf2df-d35c-4665-9646-0e2883764b39-x8883r.webp",
      fileid: "476b7f90-d206-41b6-ba9c-630b9859a9b3",
      author: "tomo3D",
      author_url: "https://makerworld.com/en/@tomo3D",
      license: "CC BY-SA 4.0"
    },
    {
      title: "Cute Flexi Pets Raccoon",
      description: "I would like to create a new line of small flexi animals that are easy to print (print-in-place) and without supports. The number 5 is this baby Raccoon, how does it look? 😃 Print-in-place, No Support Required. Keychain version included! 🦛",
      price: 5.43,
      features: ["MultiColor + AMS", "Fan Favorite", "Fruit Collection"],
      image: "https://utfs.io/f/77679f0a-975c-4666-95c5-feb8b56e82ff-w6c58r.webp",
      fileid: "fb8a567f-36e6-4981-9ccb-d8f3b14e4e11",
      author: "woohng",
      author_url: "https://makerworld.com/en/@woohng",
      license: "CC BY-SA 4.0"
    }
  ];

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
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      <BackgroundEffects /> {/* Use the new component */}
      
      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 relative z-10 mt-20">
        {showAlert && (
          <div className="bg-blue-500 text-white p-4 rounded mb-4 flex items-center">
            <FaInfoCircle className="mr-2" />
            You are already logged in.
          </div>
        )}
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row justify-center items-center">
          <div className="max-w-md p-2 ">
            <h1 className="text-4xl font-bold mb-3">Custom 3D Prints Done Right</h1>
            <p className="text-lg mb-6 font-light">Bringing your ideas to life, one layer at a time.</p>
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <button className="primary-button font-semibold text-sm">See our Model Library</button>
              <button className="secondary-button font-semibold text-sm">Contact Sales</button>
            </div>
          </div>
          <div className="max-w-md p-6 rounded w-full md:w-1/2 mt-6 md:mt-0">
            <h2 className="text-xl font-bold mb-2">Get a custom quote now!</h2>
            <p className="text-sm mb-4 opacity-70">*No Account Needed</p>
          </div>
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
        <section className="py-8 px-4 max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Featured Products</h2>
          <Slider {...settings}>
            {products.map((plan, index) => (
              <div key={index} className="px-2">
                <PricingPlan {...plan} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </Slider>
        </section>
      </main>

      {/* Footer */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

export default Home;