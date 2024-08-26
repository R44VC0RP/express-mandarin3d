import Header from '../components/Header';
import axios from 'axios';
import { useState } from 'react';

function Home(){
    const api_url = process.env.REACT_APP_BACKEND_URL
    const [message, setMessage] = useState('')
    const apiCall = () => {
        axios.get(api_url + '/test').then((data) => {
            console.log(data)
            setMessage(data.data.message)
        })
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Home</h1>
                <p className="mb-4">Backend link is {api_url || 'Not set'}</p>
                <button 
                    onClick={apiCall}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Click me
                </button>
                <p>{message}</p>
            </main>
        </div>
    )
}

export default Home;