import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Cog, Palette } from "lucide-react"
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LuxuryMarketplace() {
  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[100px] opacity-30 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[100px] opacity-30 translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-1/2 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/4"></div>
        
        {/* Slanted lines with random filled squares */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(13, 147, 155, 0.5) 49%, rgba(13, 147, 155, 0.5) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(13, 147, 155, 0.5) 49%, rgba(13, 147, 155, 0.5) 51%, transparent 52%)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Randomly filled squares */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(13, 147, 155, 0.3) 10%, transparent 10%)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px',
          mask: `
            linear-gradient(45deg, rgba(0,0,0,0.1) 48%, black 49%, black 51%, rgba(0,0,0,0.1) 52%),
            linear-gradient(-45deg, rgba(0,0,0,0.1) 48%, black 49%, black 51%, rgba(0,0,0,0.1) 52%)
          `,
          maskSize: '60px 60px'
        }}></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b border-white border-opacity-10">
        <Header />
      </div>

      {/* Main content */}
      <div className="relative z-10  text-white">
        <main className="container mx-auto px-4 py-16">
          <section className="relative overflow-hidden rounded-3xl mb-16 shadow-2xl">
            <img
              src="https://cdn.sparkfun.com/assets/home_page_posts/2/6/5/8/3D_Printed_Cookie_Cutters.jpg"
              alt="3D Printed Cookie Cutters"
              className="object-cover w-full h-[60vh]"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex flex-col justify-center p-8">
              <h1 className="text-5xl font-bold mb-4">3D Print Hub.<br />Bring your ideas to life.</h1>
              <p className="text-xl mb-8 max-w-2xl">
                Discover premium 3D printable designs from world-class creators. From cookie cutters to complex machinery, unleash your creativity.
              </p>
              <Button className="w-fit" size="lg">
                Explore Collections <ChevronRight className="ml-2" />
              </Button>
            </div> 
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Featured Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Home Decor', icon: Home },
                { name: 'Gadgets', icon: Cog },
                { name: 'Art', icon: Palette },
                { name: 'Fashion', icon: Cog },
              ].map((category) => (
                <div key={category.name} className="bg-white bg-opacity-5 rounded-xl p-4 text-center hover:bg-opacity-10 transition-all backdrop-blur-md shadow-lg border border-white border-opacity-10 group">
                  <div className="w-12 h-12 bg-[#0D939B] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8">Latest Designs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-300 mb-2">By {item.designer}</p>
                    <p className="font-bold">${item.price}</p>
                    <Button className="w-full mt-4" >Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-50">
        <Footer />
      </div>
      
    </div>
  )
}