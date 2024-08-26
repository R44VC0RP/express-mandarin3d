import Header from '../components/Header';
import axios from 'axios';
import { useState } from 'react';

function Home(){
    const api_url = process.env.REACT_APP_BACKEND_URL
    
    return (
        <div className="min-h-screen bg-[#0F0F0F]">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Home</h1>
            </main>
        </div>
    )
}

export default Home;