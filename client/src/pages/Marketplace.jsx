import React, { useEffect, useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Zap, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/Cart';
import Loading from 'react-fullscreen-loading';
import axios from 'axios';
import { toast } from 'sonner';
import ShowcaseProduct from '../components/ShowcaseProduct';

export default function Marketplace() {
  const { isAuthenticated, user, loading } = useAuth();
  const cart = useCart();
  const [localLoading, setLocalLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [featuredCollection, setFeaturedCollection] = useState(null);

  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
    }
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    fetchProducts();
    fetchFeaturedCollection();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedTags]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/product?action=list`);
      if (response.data.status === 'success') {
        setProducts(response.data.result);
        const allTags = [...new Set(response.data.result.flatMap(product => product.tags || []))];
        setTags(allTags);
      } else {
        console.error('Error fetching products:', response.data.message);
        toast.error('Failed to fetch products. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('An error occurred while fetching products. Please try again later.');
    }
  };

  const fetchFeaturedCollection = async () => {
    try {
      // Replace this with your actual API call to fetch the featured collection
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/collection?action=featured`);
      if (response.data.status === 'success') {
        setFeaturedCollection(response.data.result);
      } else {
        console.error('Error fetching featured collection:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching featured collection:', error);
    }
  };

  const filterProducts = () => {
    if (selectedTags.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        selectedTags.every(tag => product.tags && product.tags.includes(tag))
      );
      setFilteredProducts(filtered);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  if (localLoading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {featuredCollection && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <img 
              src={featuredCollection.image_url} 
              alt={featuredCollection.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
              <div className="p-6 w-full backdrop-blur-md bg-black bg-opacity-30">
                <h2 className="text-3xl font-bold mb-2">{featuredCollection.name}</h2>
                <p className="text-lg mb-4">{featuredCollection.description}</p>
                <Button className="primary-button">View Collection</Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4">
            <Card className="bg-[#2A2A2A] border-[#5E5E5E]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2" />
                  Filter by Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {tags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "secondary" : "ghost"}
                      className="mr-2 mb-2"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Marketplace</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ShowcaseProduct
                  key={product.fileid}
                  product_title={product.name}
                  product_description={product.description}
                  product_image_url={product.image}
                  product_price={product.price}
                  product_features={product.tags || []}
                  product_fileid={product.fileid}
                  product_author={product.author}
                  product_author_url={product.author_url}
                  product_license={product.license}
                  onAddToCart={() => cart.addFile(product.fileid)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}