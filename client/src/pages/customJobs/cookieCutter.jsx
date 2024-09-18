import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ArrowRight } from 'lucide-react';


import BackgroundEffects from '../../components/BackgroundEffects'; // Import the new component

export default function CookieCutterForm() {

    return (
        <div className="min-h-screen">
            <BackgroundEffects />
            <Header />
            {/* <section className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden p-4 w-3/4 mx-auto z-10 relative">
                <h1 className="text-4xl font-semibold mb-8">Our Product Library</h1>
                <div className="flex flex-row items-center justify-center space-x-8">
                    <a href="/projects/cookie-cutters" className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-[#0D939B] flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-white text-lg font-semibold">Cookie Cutters</span>
                    </a>
                    <a href="/projects/cookie-cutters" className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-[#0D939B] flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-white text-lg font-semibold">Stylized Nameplates</span>
                    </a>
                </div>
            </section> */}
            <main className="z-10 flex flex-col md:flex-row px-4 py-16 space-y-8 md:space-y-0 md:space-x-8 w-3/4 mx-auto">

                <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden p-4 w-full md:w-1/2 overflow-y-auto z-10">
                    <h1 className="text-4xl font-semibold mb-8">Custom Cookie Cutter</h1>
                    <p className="text-sm text-white mb-8">
                        Do you like cookies? Do you like cutting out cookie shapes? If you do, then you need a custom cookie cutter!
                        <br />
                        <br />
                        All we need from you is a picture of the cookie cutter design that you want to make, this can be a picture
                        of an existing cookie cutter design or a drawing of the design you want.
                        <br />
                        <br />
                        Our cookie cutters can support variable depths, so if you want a raised design, or a recessed design, we can do that
                        to create custom indents in your cookies.
                    </p>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-[#0D939B] text-white rounded-full">1</div>
                                <span className="text-white">Designing</span>
                            </div>
                            <ArrowRight className="w-8 text-white" />
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-[#0D939B] text-white rounded-full">2</div>
                                <span className="text-white">Ordering</span>
                            </div>
                            <ArrowRight className="w-8 text-white" />
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-[#0D939B] text-white rounded-full">3</div>
                                <span className="text-white">Printing</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-white text-sm mb-8">
                        <br />
                        <span className="text-white font-semibold">Initial Design Charge: $5</span>
                        <br />
                        This is a non-refundable deposit to cover the cost of designing your cookie cutter, after the design is complete,
                        you will receive an email with a link to add the file to your cart and you can order as many cookie cutters as you want at the
                        with no extra design charge.
                        <br />
                        <br />
                        <span className="text-white font-semibold">Timeframe: 24 hours</span>
                        <br />
                        We will get your design completed as quickly as possible, usually within 24 hours.
                        <br />
                        <br />
                    </p>
                    <form className="space-y-8">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium text-white">Name</Label>
                            <Input id="name" className="mt-1 bg-white border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-white">Email</Label>
                            <Input id="email" type="email" className="mt-1 bg-white border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="text-sm font-medium text-white">Phone</Label>
                            <Input id="phone" type="tel" className="mt-1 bg-white border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-white">Upload Images (up to 5)</Label>
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">

                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span className="px-2 py-1">Upload files</span>
                                            <Input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>

                        </div>
                        <div>
                            <Label htmlFor="comments" className="text-sm font-medium text-white">Additional Comments</Label>
                            <Textarea id="comments" className="mt-1 bg-white border-gray-300 rounded-lg" />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                            Pay $5 Initial Design Charge
                        </Button>
                    </form>
                    <p className="mt-6 text-sm text-gray-500 text-center">
                        Once the design is completed, you will receive an email with a link to add the file to your cart.
                    </p>
                </div>
                <div className="w-full md:w-1/2 flex items-start justify-center md:sticky md:top-5 h-auto md:h-screen z-10 rounded-2xl overflow-hidden  mt-4">
                    <div className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden">
                        <h2 className="text-2xl font-semibold text-center p-4">Cookie Cutter Preview</h2>
                        <img
                            src="https://cdn.sparkfun.com/assets/home_page_posts/2/6/5/8/3D_Printed_Cookie_Cutters.jpg"
                            alt="Cookie Cutter Preview"
                            className="p-3 rounded-2xl shadow-lg"
                        />
                    </div>
                </div>

            </main>
            <div className="relative z-50">
                <Footer />
            </div>

        </div>
    )
}