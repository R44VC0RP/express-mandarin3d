import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const News = () => {
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPressReleases = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/press-releases`);
        if (response.data.status === 'success') {
          setPressReleases(response.data.pressReleases);
        } else {
          setError('Failed to fetch press releases');
        }
      } catch (error) {
        console.error('Error fetching press releases:', error);
        setError('An error occurred while fetching press releases');
      } finally {
        setLoading(false);
      }
    };

    fetchPressReleases();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-900/20 border border-red-700/30 text-red-400 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
              News & Updates
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
            Latest News & Press Releases
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Stay updated with the latest announcements and developments from Mandarin 3D
          </p>
        </div>
        
        {pressReleases.length === 0 ? (
          <div className="text-center py-12 bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg">
            <p className="text-xl text-gray-400">No press releases available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pressReleases.map((article) => (
              <div key={article.article_id} className="group bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800/50 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/20">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image_url || 'https://via.placeholder.com/600x400?text=Mandarin+3D'} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <FaCalendarAlt className="mr-1 text-cyan-500/70" />
                    <span>{formatDate(article.dateCreated)}</span>
                    {article.author && (
                      <>
                        <span className="mx-2">•</span>
                        <FaUser className="mr-1 text-cyan-500/70" />
                        <span>{article.author}</span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">{article.title}</h2>
                  <p className="text-gray-400 mb-4 line-clamp-3">{article.summary}</p>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-300 border border-cyan-700/30">
                          <FaTag className="mr-1 text-xs" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link 
                    to={`/news/${article.slug}`} 
                    className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-md hover:from-cyan-700 hover:to-cyan-800 transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default News; 