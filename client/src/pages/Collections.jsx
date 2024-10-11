import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundEffects from '@/components/BackgroundEffects';
import PricingPlan from '@/components/ShowcaseProduct';
import Loading from 'react-fullscreen-loading';
import { useCart } from '@/context/Cart';

export default function CollectionPage() {
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const { collectionId } = useParams();
  const { addFile } = useCart();

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/collection/${collectionId}`);
        if (response.data.status === 'success') {
          if (response.data.isProtected) {
            setIsProtected(true);
          } else {
            setCollection(response.data.collection);
            setProducts(response.data.products);
          }
        } else {
          toast.error('Failed to fetch collection data');
        }
      } catch (error) {
        console.error('Error fetching collection data:', error);
        toast.error('An error occurred while fetching collection data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId]);

  const handleAddToCart = async (product_fileid) => {
    try {
      const result = await addFile(product_fileid);
      if (result.status === 'success') {
        toast.success('File added to cart successfully');
      } else {
        toast.error(result.message || 'Failed to add file to cart');
      }
    } catch (error) {
      console.error('Error adding file to cart:', error);
      toast.error('An error occurred while adding the file to cart');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/collection/${collectionId}/verify-password`, { password });
      if (response.data.status === 'success') {
        setIsProtected(false);
        setCollection(response.data.collection);
        setProducts(response.data.products);
      } else {
        toast.error('Incorrect password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast.error('An error occurred while verifying the password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loading loading={isLoading} background="#0F0F0F" loaderColor="#FFFFFF" />
      {!isLoading && (
        <div className="min-h-screen text-white relative overflow-hidden">
          <BackgroundEffects className="z-0" />
          <Header />
          
          <main className="relative z-10">
            {isProtected ? (
              <section className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
                <form onSubmit={handlePasswordSubmit} className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-6 text-center">Password Protected Collection</h2>
                  <p className="mb-4 text-center text-gray-400">This collection is password protected. Please enter the password to view its contents.</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded"
                  />
                  <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300">
                    Submit
                  </button>
                </form>
              </section>
            ) : (
              collection && (
                <>
                  {/* Hero Section */}
                  <section className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden flex items-center justify-center">
                    {collection.collection_image_url && (
                      <img
                        src={collection.collection_image_url}
                        alt={collection.collection_name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4">
                        {collection.collection_name}
                      </h1>
                    </div>
                  </section>

                  {/* Collection Description */}
                  <section className="container mx-auto px-4 py-8">
                    <p className="text-lg text-center">{collection.collection_description}</p>
                  </section>

                  {/* Products Grid */}
                  <section className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                      {products.map((product) => (
                        <div key={product.product_id}>
                          <PricingPlan
                            product_id={product.product_id}
                            product_title={product.product_title}
                            product_description={product.product_description}
                            product_features={product.product_features}
                            product_image_url={product.product_image_url}
                            product_fileid={product.product_fileid}
                            file_obj={product.file_obj}
                            onAddToCart={handleAddToCart}
                            product_price={product.product_price}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )
            )}
          </main>

          <Footer className="relative z-20" />
        </div>
      )}
    </>
  );
}