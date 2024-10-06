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
  const { collectionId } = useParams();
  const { addFile } = useCart();

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/collection/${collectionId}`);
        if (response.data.status === 'success') {
          console.log(response.data);
          setCollection(response.data.collection);
          setProducts(response.data.products);
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

  return (
    <>
      <Loading loading={isLoading} background="#0F0F0F" loaderColor="#FFFFFF" />
      {!isLoading && collection && (
        <div className="min-h-screen text-white relative overflow-hidden">
          <BackgroundEffects className="z-0" />
          <Header />
          
          <main className="relative z-10">
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
                    />
                  </div>
                ))}
              </div>
            </section>
          </main>

          <Footer className="relative z-20" />
        </div>
      )}
    </>
  );
}