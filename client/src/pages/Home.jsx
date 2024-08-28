import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle } from 'react-icons/fa';
import ProductItem from '../components/ProductItem';
import PricingPlan from '../components/PricingPlan';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
	const { isAuthenticated, user, loading } = useAuth();
	const [localLoading, setLocalLoading] = useState(true);
	const [showAlert, setShowAlert] = useState(false);
	const location = useLocation();
	const [showcaseProducts, setShowcaseProducts] = useState([]);

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
		}
	}, [location]);

	useEffect(() => {
		// This is where you would fetch the showcase products from the server
		// For now, we'll use local data
		const localShowcaseProducts = [
			{
				imageUrl: "https://via.placeholder.com/400x300",
				title: "Custom 3D Model",
				description: "Bring your ideas to life with our custom 3D modeling service."
			},
			{
				imageUrl: "https://via.placeholder.com/400x300",
				title: "Rapid Prototyping",
				description: "Quick turnaround for your prototype needs."
			},
			{
				imageUrl: "https://via.placeholder.com/400x300",
				title: "Large Scale Printing",
				description: "Big ideas? We've got you covered with our large format printers."
			},
			{
				imageUrl: "https://via.placeholder.com/400x300",
				title: "Precision Parts",
				description: "High-quality, precise parts for your projects."
			},
			{
				imageUrl: "https://via.placeholder.com/400x300",
				title: "Material Variety",
				description: "Choose from a wide range of materials for your prints."
			},
			{
				imageUrl: "https://via.placeholder.com/400x300",
				title: "Finishing Services",
				description: "Professional finishing touches for a polished result."
			}
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
			title: "Basic",
			price: 19,
			features: ["5 prints per month", "Basic support", "Access to library"]
		},
		{
			title: "Pro",
			price: 49,
			features: ["15 prints per month", "Priority support", "Custom designs"]
		},
		{
			title: "Enterprise",
			price: 99,
			features: ["Unlimited prints", "24/7 support", "Dedicated account manager"]
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
		<div className="min-h-screen bg-[#0F0F0F] text-white">
			<Header />
			<main className="container mx-auto px-4 py-8">
				{showAlert && (
					<div className="bg-blue-500 text-white p-4 rounded mb-4 flex items-center">
						<FaInfoCircle className="mr-2" />
						You are already logged in.
					</div>
				)}
				{/* Hero Section */}
				<section className="flex flex-col md:flex-row justify-between items-center">
					<div className="max-w-md p-2">
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
						<div className="border-2 border-dashed border-gray-600 p-6 rounded text-center h-64">
							<p className="text-gray-500">Drop .stl, .step, .3mf files here!</p>
						</div>
					</div>
				</section>
				{/* End Hero Section */}
				{/* Product Showcase Section */}
				<section className="py-8">
					<h2 className="text-3xl font-bold mb-6">Our Products</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{showcaseProducts.map((product, index) => (
							<ProductItem key={index} {...product} />
						))}
					</div>
				</section>

				{/* Pricing Plans Section */}
				<section className="py-8 px-4">
					<h2 className="text-3xl font-bold mb-6">Our Pricing Plans</h2>
					<Slider {...settings}>
						{pricingPlans.map((plan, index) => (
							<div key={index} className="px-2">
								<PricingPlan {...plan} />
							</div>
						))}
					</Slider>
				</section>
			</main>
		</div>
	);
}

export default Home;