import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaStar, FaRegStar, FaEye, FaEyeSlash, FaCalendarAlt, FaUser, FaLink, FaTimes, FaImage, FaCode, FaDesktop } from 'react-icons/fa';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadButton } from "../../utils/uploadthing";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";

const PressReleases = () => {
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    image_url: '',
    author: '',
    tags: '',
    featured: false,
    published: true,
    slug: ''
  });

  useEffect(() => {
    fetchPressReleases();
  }, []);

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/press-releases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTagsChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value
    });
  };

  const handleSlugify = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData({
        ...formData,
        slug
      });
    }
  };

  const openSheet = (article = null) => {
    if (article) {
      setCurrentArticle(article);
      setFormData({
        title: article.title,
        content: article.content,
        summary: article.summary,
        image_url: article.image_url || '',
        author: article.author || '',
        tags: article.tags ? article.tags.join(', ') : '',
        featured: article.featured || false,
        published: article.published !== undefined ? article.published : true,
        slug: article.slug
      });
    } else {
      setCurrentArticle(null);
      setFormData({
        title: '',
        content: '',
        summary: '',
        image_url: '',
        author: '',
        tags: '',
        featured: false,
        published: true,
        slug: ''
      });
    }
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setCurrentArticle(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      const payload = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        image_url: formData.image_url,
        author: formData.author,
        tags: tagsArray,
        featured: formData.featured,
        published: formData.published,
        slug: formData.slug
      };
      
      let response;
      
      if (currentArticle) {
        // Update existing press release
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/press-releases/${currentArticle.article_id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.status === 'success') {
          toast.success('Press release updated successfully');
          fetchPressReleases();
          closeSheet();
        }
      } else {
        // Create new press release
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/press-releases`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.status === 'success') {
          toast.success('Press release created successfully');
          fetchPressReleases();
          closeSheet();
        }
      }
    } catch (error) {
      console.error('Error saving press release:', error);
      toast.error(error.response?.data?.message || 'Failed to save press release');
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this press release? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/press-releases/${articleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.status === 'success') {
          toast.success('Press release deleted successfully');
          fetchPressReleases();
        }
      } catch (error) {
        console.error('Error deleting press release:', error);
        toast.error('Failed to delete press release');
      }
    }
  };

  const toggleFeatured = async (article) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/press-releases/${article.article_id}`,
        { featured: !article.featured },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status === 'success') {
        toast.success(`Article ${article.featured ? 'removed from' : 'added to'} featured`);
        fetchPressReleases();
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const togglePublished = async (article) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/press-releases/${article.article_id}`,
        { published: !article.published },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status === 'success') {
        toast.success(`Article ${article.published ? 'unpublished' : 'published'}`);
        fetchPressReleases();
      }
    } catch (error) {
      console.error('Error updating published status:', error);
      toast.error('Failed to update published status');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (featured, published) => {
    if (featured && published) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    if (published) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white/90">Press Releases</h1>
          <p className="text-gray-400 mt-1">Manage press releases and news articles</p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full mt-2"></div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white/90">Press Releases</h1>
          <p className="text-gray-400 mt-1">Manage press releases and news articles</p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full mt-2"></div>
        </div>
        <div className="bg-red-900/20 border border-red-700/30 text-red-400 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white/90">Press Releases</h1>
        <p className="text-gray-400 mt-1">Manage press releases and news articles</p>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full mt-2"></div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-400">
              Total articles: <span className="text-white font-medium">{pressReleases.length}</span>
            </p>
          </div>
          <Button
            onClick={() => openSheet()}
            className="rounded-full px-4 py-1.5 flex items-center bg-cyan-600/90 hover:bg-cyan-700/90 text-white text-xs font-medium"
          >
            <FaPlus className="mr-2" /> Add New Article
          </Button>
        </div>

        <Card className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1e2229] border-b border-neutral-800">
                  <TableHead className="py-3 text-white font-medium">Title</TableHead>
                  <TableHead className="py-3 text-white font-medium">
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-3.5 h-3.5 mr-2 text-cyan-400/70" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="py-3 text-white font-medium">
                    <div className="flex items-center">
                      <FaUser className="w-3.5 h-3.5 mr-2 text-cyan-400/70" />
                      Author
                    </div>
                  </TableHead>
                  <TableHead className="py-3 text-white font-medium">
                    <div className="flex items-center">
                      <FaLink className="w-3.5 h-3.5 mr-2 text-cyan-400/70" />
                      Slug
                    </div>
                  </TableHead>
                  <TableHead className="py-3 text-white font-medium">Status</TableHead>
                  <TableHead className="py-3 text-white font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pressReleases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FaRegStar className="h-10 w-10 mb-2 text-gray-500/50" />
                        <p className="text-lg font-medium mb-1">No press releases found</p>
                        <p className="text-sm text-gray-500">Create your first press release to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pressReleases.map((article) => (
                    <TableRow 
                      key={article.article_id} 
                      className="hover:bg-[#2A2A2A]/30 border-b border-neutral-800/50 transition-colors duration-150"
                    >
                      <TableCell>
                        <div className="font-medium text-white">{article.title}</div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">{article.summary}</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-gray-300">
                        {formatDate(article.dateCreated)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-cyan-800/30 flex items-center justify-center border border-cyan-700/20">
                            <FaUser className="text-cyan-500/70 text-xs" />
                          </div>
                          <span className="text-sm text-gray-200">{article.author || 'Anonymous'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {article.slug}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge className={`border ${getStatusColor(article.featured, article.published)} inline-flex items-center rounded-md px-2 py-1 text-xs`}>
                            {article.featured ? <FaStar className="mr-1 text-xs" /> : null}
                            {article.published ? 'Published' : 'Draft'}
                          </Badge>
                          {article.featured && (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-md px-2 py-0.5 text-xs font-normal">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => toggleFeatured(article)}
                            className={`${article.featured ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-gray-400'} transition-colors`}
                            title={article.featured ? "Remove from featured" : "Add to featured"}
                          >
                            {article.featured ? <FaStar /> : <FaRegStar />}
                          </button>
                          <button
                            onClick={() => togglePublished(article)}
                            className={`${article.published ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-500 hover:text-gray-400'} transition-colors`}
                            title={article.published ? "Unpublish" : "Publish"}
                          >
                            {article.published ? <FaEye /> : <FaEyeSlash />}
                          </button>
                          <a
                            href={`/news/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="View press release"
                          >
                            <FaDesktop />
                          </a>
                          <button
                            onClick={() => openSheet(article)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(article.article_id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Sheet for adding/editing press releases */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[75%] bg-[#0F0F0F] border-l border-neutral-800 p-0 min-w-[800px]">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-neutral-800">
              <SheetTitle className="text-xl font-bold text-white">
                {currentArticle ? 'Edit Press Release' : 'Add New Press Release'}
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={handleSlugify}
                    className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSlugify}
                      className="ml-2 px-3 py-2 bg-[#2A2A2A] text-gray-300 rounded-md hover:bg-[#363636] border border-neutral-700"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title (e.g., "my-press-release")</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Summary</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Brief summary shown in listings (max 200 characters)</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-300">Content</label>
                    <div className="flex items-center space-x-1 bg-[#1e2229] border border-neutral-700 rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(false)}
                        className={`px-3 py-1 text-xs flex items-center ${!isPreviewMode ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'}`}
                      >
                        <FaCode className="mr-1" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(true)}
                        className={`px-3 py-1 text-xs flex items-center ${isPreviewMode ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'}`}
                      >
                        <FaDesktop className="mr-1" /> Preview
                      </button>
                    </div>
                  </div>
                  
                  {isPreviewMode ? (
                    <div 
                      className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md h-[288px] overflow-y-auto prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 prose-a:transition-colors prose-strong:text-white prose-code:text-cyan-300 prose-pre:bg-[#161a21] prose-pre:border prose-pre:border-neutral-700"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  ) : (
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows="12"
                      className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      required
                    ></textarea>
                  )}
                  <p className="text-xs text-gray-500 mt-1">HTML content is supported. Use the preview button to see how your content will look.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
                  <div className="space-y-3">
                    {formData.image_url && (
                      <div className="relative w-full max-w-xs">
                        <img 
                          src={formData.image_url} 
                          alt="Article preview" 
                          className="w-full h-40 object-cover rounded-md border border-neutral-700"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, image_url: ''})}
                          className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90"
                          title="Remove image"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    )}
                    
                    {!formData.image_url && (
                      <div className="flex flex-col space-y-2">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              setFormData({...formData, image_url: res[0].url});
                              toast.success('Image uploaded successfully');
                            }
                          }}
                          onUploadError={(error) => {
                            toast.error(`Upload error: ${error.message}`);
                          }}
                          className="ut-button:bg-cyan-600 ut-button:hover:bg-cyan-700 ut-button:text-white ut-button:rounded-md ut-button:px-4 ut-button:py-2 ut-button:border-none ut-button:shadow-none ut-allowed-content:text-white"
                        />
                        <p className="text-xs text-gray-500">Upload an image for the article (max 8MB)</p>
                      </div>
                    )}
                    
                    {formData.image_url && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
                          placeholder="Image URL"
                        />
                        <Button
                          type="button"
                          onClick={() => setFormData({...formData, image_url: ''})}
                          variant="outline"
                          className="bg-[#2A2A2A] border border-neutral-700 text-gray-300 hover:bg-[#363636]"
                        >
                          <FaImage className="mr-1" /> Change
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleTagsChange}
                    className="w-full px-3 py-2 bg-[#1e2229] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated list of tags</p>
                </div>
                
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 bg-[#1e2229] border-neutral-700 text-cyan-600 focus:ring-cyan-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-300">Featured</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="h-4 w-4 bg-[#1e2229] border-neutral-700 text-cyan-600 focus:ring-cyan-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-300">Published</span>
                  </label>
                </div>
              </div>
            </div>
            
            <SheetFooter className="p-6 border-t border-neutral-800 flex justify-end space-x-3">
              <SheetClose asChild>
                <Button variant="outline" className="bg-[#2A2A2A] border border-neutral-700 text-gray-300 hover:bg-[#363636]">
                  Cancel
                </Button>
              </SheetClose>
              <Button 
                onClick={handleSubmit}
                className="bg-cyan-600 text-white hover:bg-cyan-700"
              >
                {currentArticle ? 'Update' : 'Create'}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PressReleases; 