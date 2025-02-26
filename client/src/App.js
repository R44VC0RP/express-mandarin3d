import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import AdamCad from './pages/adamtest/AdamCad';
import WasmCadViewer from './pages/adamtest/WasmCadViewer';
import { Toaster } from "@/components/ui/sonner"
import Admin from '@/components/Admin.jsx';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { AlertProvider } from './context/AlertContext';
import AlertManager from './components/AlertManager'; // Add this import
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/Cart';
import Hex from './pages/Hex';
import Loading from 'react-fullscreen-loading';
import LuxuryMarketplace from './pages/Marketplace_7';
import FullPageDropzone from './components/FullPageDropzone'; // {{ add: import FullPageDropzone }}
import CookieCutterForm from './pages/customJobs/cookieCutter';
import OrderConfirmation from './pages/Confirmation';
import CollectionPage from './pages/Collections';
import Products from './pages/Products';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useCart } from './context/Cart';
import CustomNameplate from './pages/CustomNameplate';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import FilePreview from './pages/FilePreview';
import Upload from './pages/Upload';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
  }
  
  return isAuthenticated ? children : <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} />;
};

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/?code=C01" /> : <Login />;
};

const Quote = () => {
  const { quoteId } = useParams();
  const { addFile } = useCart();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuoteAndAddToCart = async () => {
      try {
        // Fetch quote details
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/quote/get/${quoteId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data.status === 'success') {
          setQuote(response.data.quote);
          
          // Extract file IDs from the quote
          const fileIds = response.data.quote.quote_files.map(file => file.fileid);
          console.log(fileIds);
          for (const file of fileIds) {
            await addFile(file);
          }
          // Add files to cart
          //await addFile(fileIds);
          toast.success('Quote files added to cart');
          window.location.href = '/cart';
        } else {
          toast.error('Failed to fetch quote details');
        }
      } catch (error) {
        console.error('Error fetching quote or adding to cart:', error);
        toast.error('An error occurred while processing the quote');
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteAndAddToCart();
  }, [quoteId]);

  if (loading) {
    return <div>Loading quote details...</div>;
  }

  if (!quote) {
    return <div>Quote not found</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quote Details</h2>
      <p>Quote ID: {quoteId}</p>
      <p>Comments: {quote.quote_comments}</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Files:</h3>
      <ul>
        {quote.quote_files.map((file, index) => (
          <li key={index}>{file.filename}</li>
        ))}
      </ul>
      <p className="mt-4">Files have been added to your cart.</p>
    </div>
  );
};

function App() {
  return (
    <AlertProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
            <FullPageDropzone>
              <Routes>
                <Route path="/adamcad" element={<AdamCad />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/hex" element={<Hex />} />
                <Route path="/marketplace" element={<LuxuryMarketplace />} />
                <Route path="/products/cookie-cutters" element={<CookieCutterForm />} />
                <Route path="/confirmation/:orderId" element={<OrderConfirmation  />} />
                <Route path="/quote/:quoteId" element={<Quote />} />
                {/* Client Sections */}
                <Route path="/products" element={<Products />} />
                <Route path="/collections/:collectionId" element={<CollectionPage />} />
                <Route path="/file/:fileId" element={<FilePreview />} />
                {/* News Section */}
                <Route path="/news" element={<News />} />
                <Route path="/news/:slug" element={<NewsArticle />} />
                {/* End of Client Sections */}
                {/* Product Sections */}
                <Route path="/custom-nameplates" element={<CustomNameplate />} />
                {/* End of Product Sections */}
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>

              <AlertManager /> 
              <Toaster richColors  />
            </FullPageDropzone>
          </Router>
        </AuthProvider>
      </CartProvider>
    </AlertProvider>
  );
}

export default App;