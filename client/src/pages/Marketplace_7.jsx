import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Users, Leaf, Crown, Search } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundEffects from '@/components/BackgroundEffects';
import dynamic from 'next/dynamic';

const ThreeJSPreview = dynamic(() => import('@/components/ThreeJSPreview'), { ssr: false });

export default function LuxuryMarketplace() {
  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#0D0D0D]">
      <BackgroundEffects />
      <Header />
      
      {/* Add search bar */}
      <div className="container mx-auto px-4 py-4 relative z-10 flex justify-center">
        <form onSubmit={handleSearch} className="flex items-center justify-center w-[90%] md:w-1/2 relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow py-2 px-4 rounded-l-full bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11B3BD] focus:bg-opacity-20 transition-all duration-300"
          />
          <Button type="submit" className="rounded-r-full bg-[#0D939B] hover:bg-[#11B3BD] transition-colors duration-300">
            <Search className="w-5 h-5" />
          </Button>
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            ⌘K
          </div>
        </form>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <section className="flex flex-col md:flex-row gap-8 mb-8 md:mb-16">
          {/* Collection showcase */}
          <div className="w-full md:w-[60%] relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="https://cdn.sparkfun.com/assets/home_page_posts/2/6/5/8/3D_Printed_Cookie_Cutters.jpg"
              alt="3D Printed Cookie Cutters Collection"
              className="object-cover w-full h-[40vh] md:h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex flex-col justify-end p-4 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">3D Print Hub</h1>
              <p className="text-base md:text-xl mb-4 md:mb-8 max-w-2xl">
                Discover our premium collection of 3D printable designs. From cookie cutters to complex machinery, unleash your creativity.
              </p>
              <Button className="w-fit p-1" size={{ default: "lg", sm: "sm" }}>
                Explore Collection <ChevronRight className="ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Individual showcase */}
          <div className="w-full md:w-[40%] bg-white bg-opacity-10 rounded-3xl backdrop-blur-md shadow-lg border border-white border-opacity-20 flex flex-col">
            <div className="relative h-48 md:h-1/2">
              <ThreeJSPreview modelPath="/assets/3d/duck.stl" />
            </div>
            <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl md:text-2xl font-bold">Geometric Vase</h2>
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    <Leaf className="w-3 h-3 mr-1" /> Eco-Friendly
                  </Badge>
                </div>
                <p className="text-gray-300 mb-2">By DesignMaster3D</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl md:text-3xl font-bold">$29.99</p>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    <Crown className="w-3 h-3 mr-1" /> Premium
                  </Badge>
                </div>
              </div>
              <div>
                <Button className="w-full mb-2">Add to Cart</Button>
                <Button variant="outline" className="w-full">
                  AR Preview
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Tabs defaultValue="explore" className="mb-8 md:mb-16">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 md:mb-8 bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-3xl p-2 h-auto">
            <TabsTrigger value="explore" className="py-2">Explore</TabsTrigger>
            <TabsTrigger value="customize" className="py-2">Customize</TabsTrigger>
            <TabsTrigger value="community" className="py-2">Community</TabsTrigger>
            <TabsTrigger value="sustainability" className="py-2">Sustainability</TabsTrigger>
          </TabsList>
          <TabsContent value="explore">
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Featured Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {['Home', 'Gadgets', 'Art', 'Fashion', 'Toys', 'Tools', 'Jewelry', 'Automotive'].map((category) => (
                  <div key={category} className="bg-white bg-opacity-10 rounded-xl p-4 text-center hover:bg-opacity-20 transition-all backdrop-blur-md shadow-lg border border-white border-opacity-20">
                    <div className="w-12 h-12 bg-[#0D939B] rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🖨️</span>
                    </div>
                    <span className="text-sm font-semibold">{category}</span>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="customize">
            <section className="bg-white bg-opacity-10 rounded-3xl p-4 md:p-8 backdrop-blur-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Customization Studio</h2>
              <p className="mb-4">Personalize your 3D models with our easy-to-use tools.</p>
              <Button>Launch Studio</Button>
            </section>
          </TabsContent>
          <TabsContent value="community">
            <section className="bg-white bg-opacity-10 rounded-3xl p-4 md:p-8 backdrop-blur-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Community Showcase</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white bg-opacity-10 rounded-xl p-4">
                    <img
                      src={`/placeholder.svg?height=200&width=200`}
                      alt={`Community Design ${item}`}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-2">Amazing Creation {item}</h3>
                    <p className="text-sm text-gray-300">By Community Member {item}</p>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="sustainability">
            <section className="bg-white bg-opacity-10 rounded-3xl p-4 md:p-8 backdrop-blur-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Eco-Friendly Designs</h2>
              <p className="mb-4">Discover 3D printable designs that prioritize sustainability and environmental consciousness.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white bg-opacity-10 rounded-xl p-4">
                    <img
                      src={`/placeholder.svg?height=200&width=200`}
                      alt={`Eco-Friendly Design ${item}`}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-2">Eco Design {item}</h3>
                    <p className="text-sm text-gray-300 mb-2">Made with recycled materials</p>
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      <Leaf className="w-3 h-3 mr-1" /> Eco-Friendly
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Latest Designs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { name: "Futuristic Cityscape", designer: "UrbanPrints", price: 49.99 },
              { name: "Modular Planter System", designer: "GreenThumb3D", price: 29.99 },
              { name: "Steampunk Chess Set", designer: "VictorianMaker", price: 79.99 },
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-2xl overflow-hidden hover:bg-opacity-20 transition-all backdrop-blur-md shadow-lg border border-white border-opacity-20">
                <div className="aspect-square relative">
                  <img
                    src="https://cdn.sparkfun.com/assets/home_page_posts/2/6/5/8/3D_Printed_Cookie_Cutters.jpg"
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-2">By {item.designer}</p>
                  <p className="font-bold text-sm sm:text-base">${item.price}</p>
                  <Button className="w-full mt-4 text-sm sm:text-base" variant="secondary">Add to Cart</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}