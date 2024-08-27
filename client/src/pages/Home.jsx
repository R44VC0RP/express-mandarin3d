import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function Home() {
	const { isAuthenticated, user, loading } = useAuth();
	const [localLoading, setLocalLoading] = useState(true);

	useEffect(() => {
		if (!loading) {
			setLocalLoading(false);
		}
	}, [loading, isAuthenticated, user]);

	useEffect(() => {
		if (user && user.role) {
			console.log('User role:', user.role);
		}
	}, [user]);

	if (localLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-[#0F0F0F] text-white">
			<Header />
			<main className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Home</h1>
				{isAuthenticated && user ? (
					<div>
						<p>Welcome, {user.username}!</p>
						{user.role === 'admin' && (
							<div className="mt-4 p-4 bg-green-800 rounded">
								<h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
								<p>This content is only visible to admins.</p>
							</div>
						)}
					</div>
				) : (
					<p>Please log in to access more features.</p>
				)}
			</main>
		</div>
	);
}

export default Home;