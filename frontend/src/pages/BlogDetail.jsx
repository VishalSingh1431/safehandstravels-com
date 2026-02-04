import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { blogsAPI } from '../config/api'

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setBlog(null)
      return
    }

    let cancelled = false

    const fetchBlog = async () => {
      setLoading(true)
      setError(null)
      try {
        let data = null
        try {
          const res = await blogsAPI.getBlogById(id)
          data = res?.blog ? res : null
        } catch (_) {
          data = null
        }
        if (!data && id) {
          try {
            const res = await blogsAPI.getBlogBySlug(id)
            data = res?.blog ? res : null
          } catch (_) {
            data = null
          }
        }
        if (cancelled) return
        if (data?.blog) {
          setBlog(data.blog)
        } else {
          setBlog(null)
        }
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load blog')
        setBlog(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchBlog()
    return () => { cancelled = true }
  }, [id])

  // Parse HTML content into sections (text and images) using useMemo
  const contentBlocks = useMemo(() => {
    if (!blog?.content) return []
    
    try {
      const htmlContent = blog.content
      // Split by image divs - look for divs containing img tags
      const imageDivPattern = /<div[^>]*class="[^"]*my-8[^"]*"[^>]*>[\s\S]*?<\/div>/gi
      const parts = []
      let lastIndex = 0
      
      // Find all image divs
      const matches = []
      let match
      while ((match = imageDivPattern.exec(htmlContent)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          fullMatch: match[0]
        })
      }
      
      // Process each image div
      matches.forEach((divMatch) => {
        // Get text before this image
        const textBefore = htmlContent.substring(lastIndex, divMatch.index).trim()
        if (textBefore) {
          parts.push({ type: 'text', content: textBefore })
        }
        
        // Extract image src and alt from the div
        const imgTagMatch = divMatch.fullMatch.match(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/i)
        if (imgTagMatch) {
          parts.push({ 
            type: 'image', 
            src: imgTagMatch[1], 
            alt: imgTagMatch[2] || '' 
          })
        }
        
        lastIndex = divMatch.index + divMatch.length
      })
      
      // Add remaining text after last image
      const remainingText = htmlContent.substring(lastIndex).trim()
      if (remainingText) {
        parts.push({ type: 'text', content: remainingText })
      }
      
      // If no images found, return entire content as text
      if (parts.length === 0) {
        return [{ type: 'text', content: htmlContent }]
      }
      
      return parts
    } catch (error) {
      console.error('Error parsing content:', error)
      return [{ type: 'text', content: blog.content }]
    }
  }, [blog?.content])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#017233] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog not found</h1>
          {error && <p className="text-gray-600 mb-4 text-sm">{error}</p>}
          <button
            onClick={() => navigate('/experiences')}
            className="px-6 py-2 bg-[#017233] text-white rounded-lg hover:bg-[#01994d] transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${blog.title} | Safe Hands Travels`}
        description={blog.description || blog.metaDescription || ''}
        keywords={blog.metaKeywords?.length ? blog.metaKeywords.join(', ') : `${blog.title}, travel blog, India travel, Safe Hands Travels`}
        image={blog.heroImage || blog.hero_image || ''}
        url={`/blog/${blog.slug || id}`}
      />
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        {/* Blog Hero Image */}
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${blog.heroImage || blog.hero_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80'})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
          </div>
          <div className="relative z-10 h-full flex items-end">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl max-w-4xl">
                {blog.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content Layout - Zigzag Pattern */}
        <section className="py-8 md:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Blog Description */}
            <div className="mb-12 text-center">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-3xl mx-auto">
                {blog.description}
              </p>
            </div>

            {/* Zigzag Content Sections */}
            {(() => {
              // Fallback to original rendering if parsing fails or returns empty
              if (!contentBlocks || contentBlocks.length === 0) {
                return (
                  <div className="blog-content text-gray-700 prose prose-lg max-w-4xl mx-auto">
                    <div 
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                      style={{ lineHeight: '1.75' }}
                    />
                  </div>
                )
              }

              const blocks = []
              let currentText = ''
              let blockIndex = 0

              // Process sections sequentially to create blocks
              contentBlocks.forEach((section) => {
                if (section.type === 'text') {
                  // Accumulate text
                  currentText += section.content
                } else if (section.type === 'image') {
                  // When we hit an image, create a block with accumulated text and this image
                  if (currentText.trim()) {
                    blocks.push({
                      text: currentText.trim(),
                      image: section,
                      index: blockIndex++
                    })
                    currentText = ''
                  } else {
                    // Image without preceding text - create image-only block
                    blocks.push({
                      text: '',
                      image: section,
                      index: blockIndex++
                    })
                  }
                }
              })

              // Add any remaining text
              if (currentText.trim()) {
                blocks.push({
                  text: currentText.trim(),
                  image: null,
                  index: blockIndex++
                })
              }

              return blocks.map((block, idx) => {
                const isEven = idx % 2 === 0
                const hasImage = block.image !== null
                const hasText = block.text !== ''

                // If no image, render text full width
                if (!hasImage && hasText) {
                  return (
                    <div key={idx} className="mb-12 md:mb-16">
                      <div 
                        className="blog-content text-gray-700 prose prose-lg max-w-4xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: block.text }}
                        style={{ lineHeight: '1.75' }}
                      />
                    </div>
                  )
                }

                // If no text, render image full width
                if (hasImage && !hasText) {
                  return (
                    <div key={idx} className="mb-12 md:mb-16">
                      <img
                        src={block.image.src}
                        alt={block.image.alt}
                        className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl shadow-2xl object-cover"
                      />
                    </div>
                  )
                }

                // Zigzag layout: even index = image left, odd index = image right
                return (
                  <div key={idx} className="mb-12 md:mb-20">
                    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-start`}>
                      {/* Image Section */}
                      {hasImage && (
                        <div className="w-full lg:w-1/2">
                          <img
                            src={block.image.src}
                            alt={block.image.alt}
                            className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl shadow-2xl object-cover"
                          />
                        </div>
                      )}

                      {/* Text Section */}
                      {hasText && (
                        <div className={`w-full ${hasImage ? 'lg:w-1/2' : 'lg:w-full'}`}>
                          <div 
                            className="blog-content text-gray-700 prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: block.text }}
                            style={{ lineHeight: '1.75' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </section>
      </div>

      {/* Custom Styles for Blog Content */}
      <style>{`
        .blog-content h2 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
          font-weight: 700;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
          color: #374151;
        }
        .blog-content img {
          margin: 2rem 0;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </>
  )
}

export default BlogDetail

