import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag, FaUser, FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NewsArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/press-releases/slug/${slug}`);
        if (response.data.status === 'success') {
          setArticle(response.data.pressRelease);
        } else {
          setError('Failed to fetch article');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('An error occurred while fetching the article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to strip HTML tags for meta description
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white">
        <Helmet>
          <title>Loading Article | Mandarin 3D</title>
        </Helmet>
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white">
        <Helmet>
          <title>Article Not Found | Mandarin 3D</title>
          <meta name="description" content="The requested article could not be found." />
        </Helmet>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-900/20 border border-red-700/30 text-red-400 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error || 'Article not found'}</span>
          </div>
          <div className="mt-6">
            <Link to="/news" className="inline-flex items-center text-cyan-500 hover:text-cyan-400 transition-colors">
              <FaArrowLeft className="mr-2" /> Back to News
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Create a clean description for meta tags
  const metaDescription = article.summary || stripHtml(article.content);
  const websiteUrl = window.location.origin;
  const articleUrl = `${websiteUrl}/news/${article.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white">
      <Helmet>
        <title>{article.title} | Mandarin 3D</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={metaDescription} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={metaDescription} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}
        
        {/* Article specific metadata */}
        {article.author && <meta property="article:author" content={article.author} />}
        <meta property="article:published_time" content={article.dateCreated} />
        {article.dateUpdated && <meta property="article:modified_time" content={article.dateUpdated} />}
        {article.tags && article.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Helmet>
      
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="mb-6 max-w-[1000px] mx-auto">
          <Link to="/news" className="inline-flex items-center text-cyan-500 hover:text-cyan-400 transition-colors">
            <FaArrowLeft className="mr-2" /> Back to News
          </Link>
        </div>
        
        <article className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-lg max-w-[1000px] mx-auto">
          {article.image_url && (
            <div className="w-full h-96 overflow-hidden">
              <img 
                src={article.image_url} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-white">{article.title}</h1>
            
            <div className="flex items-center text-sm text-gray-400 mb-6">
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
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-300 border border-cyan-700/30">
                    <FaTag className="mr-1 text-xs" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="text-white text-xl leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default NewsArticle; 