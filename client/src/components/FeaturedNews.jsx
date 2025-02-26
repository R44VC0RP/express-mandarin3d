import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const FeaturedNews = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/press-releases/featured`);
        if (response.data.status === 'success') {
          setFeaturedArticles(response.data.featuredPressReleases);
        } else {
          setError('Failed to fetch featured articles');
        }
      } catch (error) {
        console.error('Error fetching featured articles:', error);
        setError('An error occurred while fetching featured articles');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
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
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (featuredArticles.length === 0) {
    return null; // Don't show the section if there are no featured articles
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mr-3 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
              Latest Updates
            </span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">News & Announcements</h2>
            <Link to="/news" className="text-cyan-500 hover:text-cyan-400 flex items-center transition-colors">
              View All <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <div key={article.article_id} className="group bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800/50 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/20">
              {article.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <FaCalendarAlt className="mr-1 text-cyan-500/70" />
                  <span>{formatDate(article.dateCreated)}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">{article.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{article.summary}</p>
                
                <Link 
                  to={`/news/${article.slug}`} 
                  className="inline-flex items-center text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
                >
                  Read More <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews; 