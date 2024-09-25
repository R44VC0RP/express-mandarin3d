import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Users, Leaf, Crown, Search } from "lucide-react";
import { StlViewer } from "react-stl-viewer";
import { toast } from 'sonner'; 
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundEffects from '@/components/BackgroundEffects';
import axios from 'axios';
import { useCart } from '@/context/Cart';
import uploadgif from '@/assets/gifs/uploadicon.gif';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import PricingPlan from '../components/ShowcaseProduct';
import Loading from 'react-fullscreen-loading';
import PopupSTLViewer from '@/components/PopupSTLViewer';
import { Input } from '@/components/ui/input';

function hexToRgb(hex) {
  try {
    if (typeof hex !== 'string' || !hex) {
      console.log("Invalid hex color");
      return { r: 0, g: 0, b: 0 };
    }
    
    if (hex.startsWith('#')) {
      hex = hex.substring(1);
    }
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      toast.error('Invalid hex color');
      return { r: 0, g: 0, b: 0 };
    }
    
    return { r, g, b };
  } catch (error) {
    toast.error('Error converting hex to RGB:', error);
    return { r: 0, g: 0, b: 0 };
  }
}

function calculateLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const colorLuminance = calculateLuminance(r, g, b);
  const whiteLuminance = calculateLuminance(255, 255, 255);
  const blackLuminance = calculateLuminance(0, 0, 0);

  const contrastWithWhite = Math.abs(colorLuminance - whiteLuminance);
  const contrastWithBlack = Math.abs(colorLuminance - blackLuminance);

  return contrastWithWhite > contrastWithBlack ? '#F9FAFB' : '#111827';
}

const LazyModelViewer = ({ url, style, hexColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={style}>
      {isVisible ? (
        <Suspense fallback={<div>Loading...</div>}>
          <StlViewer
            style={style}
            shadows
            url={url}
            modelProps={{ color: hexColor, scale: 4 }}
          />
        </Suspense>
      ) : (
        <div style={style}>Loading...</div>
      )}
    </div>
  );
};



export default function LuxuryMarketplace() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [featuredCollection, setFeaturedCollection] = useState(null);
  const [activeTab, setActiveTab] = useState('explore');
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const { addFile } = useCart();
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchFeaturedCollection = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/collection/featured`);
        if (response.data.status === 'success') {
          setFeaturedCollection(response.data.collection);
        } else {
          console.error('Failed to fetch featured collection');
        }
      } catch (error) {
        console.error('Error fetching featured collection:', error);
      }
    };

    const fetchFeaturedProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product?action=featured_product`);
        if (response.data.status === 'success') {
          
          setFeaturedProduct(response.data.result);
        } else {
          console.error('Failed to fetch featured product');
        }
      } catch (error) {
        console.error('Error fetching featured product:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product?action=list`);
        if (response.data.status === 'success') {
          setProducts(response.data.result);
          setFilteredProducts(response.data.result);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    Promise.all([fetchFeaturedCollection(), fetchProducts(), fetchFeaturedProduct()])
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = products.filter(
      (product) =>
        product.product_title.toLowerCase().includes(query) ||
        product.product_author.toLowerCase().includes(query) ||
        product.product_tags.some(tag => tag.toLowerCase().includes(query)) || 
        product.product_description.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Loading loading={isLoading} background="#0F0F0F" loaderColor="#FFFFFF" />
      {!isLoading && (
        <div className="min-h-screen text-white relative overflow-hidden">
          <BackgroundEffects className="z-0" />
          <Header />
          
          <main className="container mx-auto px-4 py-8 md:py-16 relative w-[90vw] z-10"> 
            <section className="flex flex-col md:flex-row gap-8 mb-8 md:mb-16">
              {/* Collection showcase */}
              {featuredCollection && (
                <div className="w-full md:w-[60%] relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={featuredCollection.image_url}
                    alt={`${featuredCollection.name} Collection`}
                    className="object-cover w-full h-[40vh] md:h-full"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
                    <div className="bg-black bg-opacity-40 backdrop-blur-sm p-4 rounded-lg border-2 border-[#5E5E5E] border-opacity-20">
                      <h1 className="text-2xl md:text-4xl font-bold ">{featuredCollection.name}</h1>
                      <p className="text-base md:text-xl mb-1 md:mb-2 max-w-2xl">
                        {featuredCollection.description}
                      </p>
                      <Button className="w-fit" size='lg'>
                        Explore Collection <ChevronRight className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Individual showcase */}
              {featuredProduct && (
              <div className="w-full md:w-[40%] bg-white bg-opacity-10 rounded-3xl backdrop-blur-md shadow-lg border border-white border-opacity-20 flex flex-col">            
                <img src={featuredProduct.product_image_url} alt={featuredProduct.product_title} className="w-full h-60 object-cover rounded-t-3xl" />
                <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl md:text-2xl font-bold">{featuredProduct.product_title}</h2>
                    </div>
                    <p className="text-gray-300 mb-2">By {featuredProduct.product_author}</p>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-2xl md:text-3xl font-bold">${featuredProduct.product_price}</p>
                      {featuredProduct.product_tags.includes('featured') && (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                          <Crown className="w-3 h-3 mr-1" /> Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button className="w-full mb-2" onClick={() => handleAddToCart(featuredProduct.product_fileid)}>Add to Cart</Button>
                    <PopupSTLViewer popupUrl={featuredProduct.file_obj.utfile_url} className="w-full" />
                  </div>
                </div>
              </div>
              )}
            </section>

            <Tabs defaultValue="community" className="mb-8 md:mb-16">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 mb-4 md:mb-8 bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-3xl p-2 h-auto">
                <TabsTrigger value="customize" className="py-2">Customize</TabsTrigger>
                <TabsTrigger value="community" className="py-2">Community</TabsTrigger>
              </TabsList>
              <TabsContent value="customize">
                <section className="bg-white bg-opacity-10 rounded-3xl p-4 md:p-8 backdrop-blur-md border border-white border-opacity-20">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Customization Studio</h2>
                      <p className="mb-2">Drag and drop an STL file anywhere to get an instant quote.</p>
                      <p>Personalize your 3D models with our easy-to-use tools.</p>
                    </div>
                    <img src={uploadgif} alt="Upload" className="w-[10%] rounded-xl" />
                  </div>
                </section>
              </TabsContent>
              <TabsContent value="community">
                <section className="bg-white bg-opacity-10 rounded-3xl p-4 md:p-8 backdrop-blur-md border border-white border-opacity-20">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Community Showcase</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white bg-opacity-10 rounded-xl p-4">
                      <img
                        src={`https://utfs.io/f/RSbfEU0J8DcdR7iNkWJ8DcdibjySZAVpB2O7tHgGQlEKC0r6`}
                        alt="Community Design 1"
                        className="w-full h-60 object-cover rounded-lg mb-4 "
                      />
                      <h3 className="font-semibold mb-2">Cosplay Sword</h3>
                      <p className="text-sm text-gray-300">By Karen J</p>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-xl p-4">
                      <img
                        src={`https://utfs.io/f/RSbfEU0J8Dcdf0kqt75iJuDbelhTZQs78vAHIC6BxKEUcwXj`}
                        alt="Outdoor Design and Landscape Mockup"
                        className="w-full h-60 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold mb-2">Outdoor Design and Landscape Mockup</h3>
                      <p className="text-sm text-gray-300">By Cascade Outdoor</p>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-xl p-4">
                      <img
                        src={`https://utfs.io/f/RSbfEU0J8DcdvVK6FexENw7V0oKcHDuLB9dTyM12PqzeQmIn`}
                        alt="Community Design 3"
                        className="w-full h-60 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold mb-2">Custom Product Keychain</h3>
                      <p className="text-sm text-gray-300">By terminal.shop</p>
                    </div>
                  </div>
                </section>
              </TabsContent>
            </Tabs>

            {/* Categories and Products Listing */}
            <section className="mb-8 md:mb-16 relative z-20 w-full mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 px-3">All Products</h2>
                <div className="relative w-full md:w-64">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-[#0D939B] focus:border-transparent bg-white bg-opacity-10 backdrop-blur-md shadow-lg border-white border-opacity-20"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                {/* Categories */}
                <div className="w-full md:w-[20%] mb-4 md:mb-0 md:mr-4 bg-white bg-opacity-10 rounded-3xl p-4 md:p-8 backdrop-blur-md border border-white border-opacity-20">
                  <h3 className="text-xl font-semibold mb-2">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        All Categories
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Home Decor
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Gadgets
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Toys
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Art
                      </Button>
                    </li>
                  </ul>
                </div>
                {/* Products Grid */}
                <div className="w-full md:w-3/4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {currentProducts.map((item, index) => (
                      <div key={index} className="px-2">
                        <PricingPlan {...item} onAddToCart={handleAddToCart} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationEllipsis />
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  </PaginationContent>
                </Pagination>
              )}
            </section>
          </main>

          <Footer className="relative z-20" />
        </div>
      )}
    </>
  );
}