import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, X, Save, Search, Upload, Image as ImageIcon, Type, AlignLeft, MoveUp, MoveDown, GripVertical } from 'lucide-react';
import { blogsAPI, uploadAPI } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { authAPI } from '../config/api';

const AdminBlogs = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]); // Array of content blocks
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  const categoryOptions = ['Destinations', 'Adventure', 'Culture', 'Spiritual', 'Wellness', 'Wildlife', 'Tips', 'Travel Guide'];
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    heroImage: '',
    heroImagePublicId: '',
    category: '',
    tags: [],
    featured: false,
    status: 'draft',
    displayOrder: 0,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
  });

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        if (response.user.role !== 'admin' && response.user.role !== 'main_admin') {
          toast.error('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAllBlogsAdmin(statusFilter || '', '', '', '', 50, 0);
      setBlogs(response.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error(error.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showForm) {
      fetchBlogs();
    }
  }, [statusFilter]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Auto-generate slug from title
    if (name === 'title' && !editingBlog) {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTagChange = (tagValue) => {
    setFormData(prev => {
      const tags = prev.tags || [];
      if (tags.includes(tagValue)) {
        return { ...prev, tags: tags.filter(t => t !== tagValue) };
      } else {
        return { ...prev, tags: [...tags, tagValue] };
      }
    });
  };

  // Content Blocks Management
  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type, // 'heading', 'paragraph', 'image'
      content: type === 'image' ? { url: '', alt: '' } : '',
      level: type === 'heading' ? 2 : null, // h2, h3, h4
    };
    setContentBlocks(prev => [...prev, newBlock]);
  };

  const updateContentBlock = (id, updates) => {
    setContentBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteContentBlock = (id) => {
    setContentBlocks(prev => prev.filter(block => block.id !== id));
  };

  const moveBlock = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contentBlocks.length - 1) return;
    
    const newBlocks = [...contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  // Convert content blocks to HTML
  const blocksToHTML = () => {
    return contentBlocks.map(block => {
      if (block.type === 'heading') {
        const tag = `h${block.level || 2}`;
        return `<${tag} class="text-3xl font-bold text-gray-900 mb-4 mt-8">${block.content || ''}</${tag}>`;
      } else if (block.type === 'paragraph') {
        return `<p class="mb-6 text-lg leading-relaxed text-gray-700">${block.content || ''}</p>`;
      } else if (block.type === 'image') {
        if (block.content?.url) {
          return `<div class="my-8"><img src="${block.content.url}" alt="${block.content.alt || ''}" class="w-full rounded-2xl shadow-xl" /></div>`;
        }
        return '';
      }
      return '';
    }).filter(html => html).join('\n');
  };

  // Parse HTML to content blocks (when editing existing blog)
  const parseHTMLToBlocks = (html) => {
    if (!html) return [];
    
    const blocks = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.childNodes;
    
    elements.forEach((node, index) => {
      if (node.nodeType === 1) { // Element node
        if (node.tagName?.match(/^H[1-6]$/)) {
          const level = parseInt(node.tagName.charAt(1));
          blocks.push({
            id: Date.now() + index,
            type: 'heading',
            content: node.textContent || '',
            level: level,
          });
        } else if (node.tagName === 'P') {
          blocks.push({
            id: Date.now() + index,
            type: 'paragraph',
            content: node.textContent || '',
          });
        } else if (node.tagName === 'DIV' && node.querySelector('img')) {
          const img = node.querySelector('img');
          blocks.push({
            id: Date.now() + index,
            type: 'image',
            content: {
              url: img.src || '',
              alt: img.alt || '',
            },
          });
        } else if (node.tagName === 'IMG') {
          blocks.push({
            id: Date.now() + index,
            type: 'image',
            content: {
              url: node.src || '',
              alt: node.alt || '',
            },
          });
        }
      }
    });
    
    return blocks.length > 0 ? blocks : [{ id: Date.now(), type: 'paragraph', content: '' }];
  };

  const handleImageUploadForBlock = async (file, blockId) => {
    if (!file) return;

    try {
      setUploadingImageIndex(blockId);
      const response = await uploadAPI.uploadImage(file);
      updateContentBlock(blockId, {
        content: {
          url: response.url,
          alt: '',
        },
      });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        heroImage: response.url,
        heroImagePublicId: response.public_id,
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    if (contentBlocks.length === 0) {
      toast.error('Please add at least one content block');
      return;
    }
    
    // Convert blocks to HTML
    const htmlContent = blocksToHTML();
    
    try {
      const blogData = {
        ...formData,
        content: htmlContent,
      };

      if (editingBlog) {
        await blogsAPI.updateBlog(editingBlog.id, blogData);
        toast.success('Blog updated successfully!');
      } else {
        await blogsAPI.createBlog(blogData);
        toast.success('Blog created successfully!');
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.message || 'Failed to save blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      description: blog.description || '',
      content: blog.content || '',
      heroImage: blog.heroImage || '',
      heroImagePublicId: blog.heroImagePublicId || '',
      category: blog.category || '',
      tags: blog.tags || [],
      featured: blog.featured || false,
      status: blog.status || 'draft',
      displayOrder: blog.displayOrder || 0,
      metaTitle: blog.metaTitle || blog.title || '',
      metaDescription: blog.metaDescription || blog.description || '',
      metaKeywords: blog.metaKeywords || [],
    });
    // Parse existing HTML content to blocks
    const blocks = parseHTMLToBlocks(blog.content || '');
    setContentBlocks(blocks.length > 0 ? blocks : []);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await blogsAPI.deleteBlog(id);
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      heroImage: '',
      heroImagePublicId: '',
      category: '',
      tags: [],
      featured: false,
      status: 'draft',
      displayOrder: 0,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
    });
    setContentBlocks([]);
    setEditingBlog(null);
    setShowForm(false);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Manage Blog Posts
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Create, edit, and manage blog posts</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Add New Blog</span>
          </button>
        </div>

        {!showForm && (
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-2 sm:p-4 overflow-y-auto pt-20 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Auto-generated from title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Short description/excerpt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Image</label>
                  <div className="flex flex-col gap-3">
                    {formData.heroImage && (
                      <img src={formData.heroImage} alt="Hero" className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                        {uploading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload hero image</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                  
                  {/* Add Block Buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => addContentBlock('heading')}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      <Type className="w-4 h-4" />
                      Add Heading
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock('paragraph')}
                      className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      <AlignLeft className="w-4 h-4" />
                      Add Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock('image')}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Add Image
                    </button>
                  </div>

                  {/* Content Blocks */}
                  <div className="space-y-4 border-2 border-gray-200 rounded-lg p-4 min-h-[300px] bg-gray-50">
                    {contentBlocks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>No content blocks yet. Click buttons above to add content.</p>
                      </div>
                    ) : (
                      contentBlocks.map((block, index) => (
                        <div key={block.id} className="bg-white rounded-lg border-2 border-gray-300 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <span className="text-xs font-semibold text-gray-600 uppercase">
                                {block.type === 'heading' ? `Heading H${block.level || 2}` : block.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveBlock(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <MoveUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveBlock(index, 'down')}
                                disabled={index === contentBlocks.length - 1}
                                className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <MoveDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteContentBlock(block.id)}
                                className="p-1 text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Heading Block */}
                          {block.type === 'heading' && (
                            <div className="space-y-2">
                              <select
                                value={block.level || 2}
                                onChange={(e) => updateContentBlock(block.id, { level: parseInt(e.target.value) })}
                                className="px-3 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value={2}>H2 - Large Heading</option>
                                <option value={3}>H3 - Medium Heading</option>
                                <option value={4}>H4 - Small Heading</option>
                              </select>
                              <input
                                type="text"
                                value={block.content || ''}
                                onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                                placeholder="Enter heading text..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-lg"
                              />
                            </div>
                          )}

                          {/* Paragraph Block */}
                          {block.type === 'paragraph' && (
                            <textarea
                              value={block.content || ''}
                              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                              placeholder="Enter paragraph text..."
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          )}

                          {/* Image Block */}
                          {block.type === 'image' && (
                            <div className="space-y-3">
                              {block.content?.url ? (
                                <div className="relative">
                                  <img src={block.content.url} alt={block.content.alt || ''} className="w-full h-48 object-cover rounded-lg border-2 border-gray-300" />
                                  <button
                                    type="button"
                                    onClick={() => updateContentBlock(block.id, { content: { url: '', alt: '' } })}
                                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="cursor-pointer">
                                  <div className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                                    {uploadingImageIndex === block.id ? (
                                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                    ) : (
                                      <>
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-600">Click to upload image</span>
                                      </>
                                    )}
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUploadForBlock(file, block.id);
                                    }}
                                    className="hidden"
                                    disabled={uploadingImageIndex === block.id}
                                  />
                                </label>
                              )}
                              {block.content?.url && (
                                <input
                                  type="text"
                                  value={block.content.alt || ''}
                                  onChange={(e) => updateContentBlock(block.id, { 
                                    content: { ...block.content, alt: e.target.value } 
                                  })}
                                  placeholder="Image alt text (for SEO)..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Add content blocks to build your blog post. Content will be converted to HTML automatically.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-semibold text-gray-700">Featured Post</label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {editingBlog ? 'Update Blog' : 'Create Blog'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {filteredBlogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No blogs found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Views</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBlogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2">
                            {blog.heroImage && (
                              <img src={blog.heroImage} alt={blog.title} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div>
                              <span className="font-semibold text-gray-900 text-sm sm:text-base">{blog.title}</span>
                              {blog.featured && (
                                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Featured</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm">{blog.category || '-'}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            blog.status === 'published' ? 'bg-green-100 text-green-800' :
                            blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-700 text-sm">{blog.views || 0}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(blog)}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;

