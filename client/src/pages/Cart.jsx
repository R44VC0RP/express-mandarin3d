import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { generateClientDropzoneAccept } from "uploadthing/client";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import PricingPlan from '../components/ShowcaseProduct';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FileUploadProgress from '../components/FileUploadProgress';
import { useCart } from '../context/Cart';
import ShoppingCartItem from '../components/ShoppingCartItem';

// Asset Imports
import prining_bambu from '../assets/videos/printing_bambu.mp4'
import fusion360 from '../assets/images/fusion360.gif'
import building from '../assets/images/outdoor.png'

// Import the useUploadThing hook
import { useUploadThing } from "../utils/uploadthing";

function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const cart = useCart();
  const [localLoading, setLocalLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const [showcaseProducts, setShowcaseProducts] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);

  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    "modelUploader",
    {
      onClientUploadComplete: (res) => {
        console.log("Files: ", res);
		
        setUploadFiles(prevFiles => prevFiles.map(file => ({
          ...file,
          status: 'success'
        })));

		for (const file of res) {
			cart.addFile(file.serverData.fileid);
		}
      },
      onUploadError: (error) => {
        alert(`ERROR! ${error.message}`);
        setUploadFiles(prevFiles => prevFiles.map(file => ({
          ...file,
          status: 'error'
        })));
      },
      onUploadBegin: () => {
        console.log("Upload has begun");
      },
    }
  );

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      status: 'uploading'
    }));
    setUploadFiles(newFiles);
    startUpload(acceptedFiles);
  }, [startUpload]);

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo.config)
    : [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/stl': ['.stl'],
      'model/3mf': ['.3mf'],
      'application/step': ['.step', '.stp']
    },
    noClick: true,
    noKeyboard: true
  });

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
    return <div>Loading...</div>;
  }

  const pricingPlans = [
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

  const handleRemoveFile = (index) => {
    if (index === null) {
      setUploadFiles([]);
    } else {
      setUploadFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }
  };

  return (
    <div {...getRootProps()} className="min-h-screen bg-[#0F0F0F] text-white">
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center z-50 border border-dotted border-[#2A2A2A]">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black">
            <p className="text-2xl font-bold">Drop your file here</p>
          </div>
        </div>
      )}
      <Header />
      <div className="mt-3 w-full border-t border-b border-[#5E5E5E] bg-[#2A2A2A]">
        <div className="flex items-center justify-left mt-2">
          <a href="/" className="ml-4 my-4 inline-block"><FaArrowLeft /></a>
          <p className="ml-2 text-3xl font-bold">Your Project</p>
        </div>
        <div className="flex items-center justify-left mb-4">
          <p className="ml-4 mr-4 inline-block text-sm font-light"><a href="/" className="text-white">Home</a> / <span className="text-white font-bold">Shopping Cart</span></p>
        </div>
        
      </div>
      <main className="container mx-auto ">
        {showAlert && (
          <div className="bg-blue-500 text-white p-4 rounded mb-4 flex items-center">
            <FaInfoCircle className="mr-2" />
            You are already logged in.
          </div>
        )}
        {/* Checkout Section */}
        <section className="px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
            {/* Left Column: Shopping Cart Items */}
            <div name="checkout-items" className="col-span-2 mt-4 lg:mt-4">
              <div className=" w-full">
                <ShoppingCartItem />
              </div>
            </div>
            {/* Right Column: Shopping Cart Config */}
            <div name="checkout-config" className="mt-4 lg:-mt-8">
            <div className="card-special w-full p-4">
                <div className="flex flex-col items-center mb-4">
                  <p className="text-xl font-bold mb-2 text-[#C7C7C7]" >Subtotal:</p>
                  <p className="text-4xl font-bold">$39.70</p>
                </div>
                <div className="mb-4">
                  
                  {/* ankermake_castle... */}
                  
                  <div className="flex justify-between">
                    <p className="font-light">ankermake_castle...</p>
                    <p className="font-bold">$7.30</p>
                  </div>
                  <p className="text-sm text-gray-400">2x</p>

                  {/* mainecoon.step */}
                  <div className="flex justify-between">
                    <p>mainecoon.step</p>
                    <p>$7.38</p>
                  </div>
                  <p className="text-sm text-gray-400">6x</p>

                  {/* lion.3mf */}
                  <div className="flex justify-between">
                    <p>lion.3mf</p>
                    <p>$6.52</p>
                  </div>
                  <p className="text-sm text-gray-400">1x</p>
                </div>

                <hr className="border-t border-[#5E5E5E] my-4" />
                <div className="flex justify-between mb-2">
                  <p className="font-light">Estimated Shipping:</p>
                  <p className="font-bold">$8.50</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="font-light">Queue Priority:</p>
                  <p className="font-bold">$10.00</p>
                </div>
                <button className="primary-button w-full py-2 rounded-lg">Checkout</button>
              </div>
              <div className="card-special w-full p-4 mt-4">
                <div className="flex flex-col items-center mb-4">
                  <p className="text-lg font-bold mb-2 text-[#C7C7C7]">Order Options and Addons:</p>
                </div>
                <p className="text-md text-white">Order Comments</p>
                <textarea className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#5E5E5E] text-white" placeholder="Add any special instructions here..."></textarea>
                <div className="flex items-start mt-2">
                  <div className="flex items-start mt-2 cursor-pointer" onClick={() => document.getElementById('multi-color-checkbox').click()}>
                    <input id="multi-color-checkbox" type="checkbox" className="mr-2 mt-1" />
                    <div>
                      <p className="text-md text-white font-bold">Enable MultiColor Printing?</p>
                      <p className="text-sm text-gray-400">Requires a followup email with our design team, we will reach out with you before your order goes to print.</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start mt-2">
                  <div className="flex items-start mt-2 cursor-pointer" onClick={() => document.getElementById('queue-priority-checkbox').click()}>
                    <input id="queue-priority-checkbox" type="checkbox" className="mr-2 mt-1" />
                    <div>
                      <p className="text-md text-white font-bold">Queue Priority? +$10.00</p>
                      <p className="text-sm text-gray-400">Move your order once placed to the top of the queue. This normally speeds up order fulfillment time by 2-3 days.</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start mt-2">
                  <div className="flex items-start mt-2 cursor-pointer" onClick={() => document.getElementById('print-assistance-checkbox').click()}>
                    <input id="print-assistance-checkbox" type="checkbox" className="mr-2 mt-1" />
                    <div>
                      <p className="text-md text-white font-bold">Print Assistance?</p>
                      <p className="text-sm text-gray-400">Get help making sure that print presets and print options are setup correctly for the best print quality. We will reach out to you before your order goes to print.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="py-8 px-4">
          <h2 className="text-3xl font-bold mb-6">Our Featured Products</h2>
          <Slider {...settings}>
            {pricingPlans.map((plan, index) => (
              <div key={index} className="px-2">
                <PricingPlan {...plan} />
              </div>
            ))}
          </Slider>
        </section>
      </main>
      <Footer />
      <FileUploadProgress files={uploadFiles} onRemove={handleRemoveFile} />
    </div>
  );
}

export default Home;