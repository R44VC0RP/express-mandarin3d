import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { FaInfoCircle } from 'react-icons/fa';

function Home() {
	const { isAuthenticated, user, loading } = useAuth();
	const [localLoading, setLocalLoading] = useState(true);
	const [showAlert, setShowAlert] = useState(false);
	const location = useLocation();

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

	if (localLoading) {
		return <div>Loading...</div>;
	}

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
				<div className="flex justify-between items-center">
					<div className="max-w-md p-2">
						<h1 className="text-4xl font-bold mb-3">Custom 3D Prints Done Right</h1>
						<p className="text-lg mb-6 font-light">Bringing your ideas to life, one layer at a time.</p>
						<div className="flex space-x-4">
							<button className="primary-button font-semibold text-sm">See our Model Library</button>
							<button className="secondary-button font-semibold text-sm">Contact Sales</button>
						</div>
					</div>
					<div className="max-w-md p-6 rounded">
						<h2 className="text-xl font-bold mb-2">Get a custom quote now!</h2>
						<p className="text-sm mb-4 opacity-70">*No Account Needed</p>
						<p className="text-sm mb-4 opacity-70">You can also paste a MakerWorld or Thingiverse link to get all models in that project.</p>
						<div className="border-2 border-dashed border-gray-600 p-6 rounded text-center">
							<p className="text-gray-500">Drop .stl, .step, .3mf files here!</p>
						</div>
					</div>
				</div>
				</main>
		</div>
	);
}

export default Home;