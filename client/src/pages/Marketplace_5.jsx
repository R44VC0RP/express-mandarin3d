import React from 'react';
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from 'next/image';

export default function LuxuryMarketplace() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#0D0D0D]">
      {/* Enhanced background with stronger light effects and faint lines */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[100px] opacity-30 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[100px] opacity-30 translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-1/2 w-2/3 h-2/3 bg-[#0D939B] rounded-full filter blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/4"></div>
        
        {/* Faint background lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(13, 147, 155, 0.5) 25%, rgba(13, 147, 155, 0.5) 26%, transparent 27%, transparent 74%, rgba(13, 147, 155, 0.5) 75%, rgba(13, 147, 155, 0.5) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(13, 147, 155, 0.5) 25%, rgba(13, 147, 155, 0.5) 26%, transparent 27%, transparent 74%, rgba(13, 147, 155, 0.5) 75%, rgba(13, 147, 155, 0.5) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <section className="relative overflow-hidden rounded-3xl mb-16 shadow-2xl">
          <Image
            src="https://cdn.sparkfun.com/assets/home_page_posts/2/6/5/8/3D_Printed_Cookie_Cutters.jpg"
            alt="3D Printed Cookie Cutters"
            width={1200}
            height={800}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Home Decor', 'Gadgets', 'Art', 'Fashion'].map((category) => (
              <div key={category} className="bg-white bg-opacity-10 rounded-xl p-6 text-center hover:bg-opacity-20 transition-all backdrop-blur-md shadow-lg border border-white border-opacity-20">
                <div className="w-24 h-24 bg-[#0D939B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🖨️</span>
                </div>
                <span className="text-lg font-semibold">{category}</span>
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
                  <Image
                    src="https://cdn.sparkfun.com/assets/home_page_posts/2/6/5/8/3D_Printed_Cookie_Cutters.jpg"
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-300 mb-2">By {item.designer}</p>
                  <p className="font-bold">${item.price}</p>
                  <Button className="w-full mt-4" variant="secondary">Add to Cart</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}