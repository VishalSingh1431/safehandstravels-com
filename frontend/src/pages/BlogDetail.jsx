import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sample blog data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const fetchBlog = async () => {
      setLoading(true)
      // In real app, fetch from API: const response = await blogsAPI.getBlogById(id)
      
      // Sample data based on blog ID
      const sampleBlogs = {
        1: {
          id: 1,
          title: 'Exploring the Mystical Beauty of Ladakh',
          heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
          description: 'Ladakh, often called the "Land of High Passes," is a region in the Indian state of Jammu and Kashmir that offers breathtaking landscapes, rich culture, and unforgettable adventures.',
          content: `
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Nestled in the northernmost part of India, Ladakh is a destination that captivates travelers with its stark beauty, ancient monasteries, and warm-hearted people. This high-altitude desert region offers a unique blend of natural wonders and cultural experiences that make it a must-visit destination for adventure seekers and culture enthusiasts alike.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Landscape" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Majestic Landscapes</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              One of the most striking features of Ladakh is its dramatic landscapes. From the snow-capped peaks of the Himalayas to the vast expanses of the Nubra Valley, every turn reveals a new vista that takes your breath away. The region is home to some of the world's highest motorable passes, including Khardung La at 18,380 feet.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Mountains" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Ancient Monasteries and Culture</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Ladakh is deeply rooted in Tibetan Buddhism, and this is evident in its numerous monasteries, or gompas, that dot the landscape. The Hemis Monastery, Thiksey Monastery, and Diskit Monastery are among the most famous, each offering a glimpse into the region's rich spiritual heritage. The monasteries are not just places of worship but also centers of learning and art, housing ancient manuscripts, thangka paintings, and intricate sculptures.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Monastery" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Adventure Activities</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              For adventure enthusiasts, Ladakh offers a plethora of activities. Trekking through the Markha Valley, white-water rafting on the Zanskar River, and mountain biking on challenging terrains are just a few of the thrilling experiences available. The region's unique geography also makes it perfect for photography, with stunning sunrises and sunsets painting the sky in vibrant colors.
            </p>
            
            <div class="my-8">
              <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80" alt="Ladakh Adventure" class="w-full rounded-2xl shadow-xl" />
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Local Cuisine and Hospitality</h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              The local cuisine of Ladakh is simple yet flavorful, with dishes like thukpa (noodle soup), momos (dumplings), and butter tea being staples. The people of Ladakh are known for their warm hospitality, and staying in a traditional homestay offers an authentic experience of their way of life.
            </p>
            
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Whether you're seeking spiritual solace, adventure, or simply want to witness some of the most beautiful landscapes on Earth, Ladakh promises an experience that will stay with you forever. The region's unique combination of natural beauty, cultural richness, and adventure opportunities makes it a destination like no other.
            </p>
          `,
          tourPackage: {
            title: 'Ladakh Adventure Tour',
            price: '₹24,999',
            duration: '7 Days',
            highlights: [
              'Visit ancient monasteries',
              'Explore Nubra Valley',
              'Pangong Lake experience',
              'Khardung La Pass',
              'Local homestay experience',
              'Traditional cuisine'
            ]
          }
        },
        2: {
          id: 2,
          title: 'Spiritual Journey Through Kashi',
          heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
          description: 'Kashi, also known as Varanasi, is one of the oldest continuously inhabited cities in the world and a spiritual hub for millions of pilgrims.',
          content: `
            <p class="mb-6 text-lg leading-relaxed text-gray-700">
              Varanasi, the spiritual capital of India, is a city that has been drawing pilgrims and travelers for thousands of years. Situated on the banks of the sacred Ganges River, this ancient city offers a profound spiritual experience that transcends time.
            </p>
          `,
          tourPackage: {
            title: 'Kashi Spiritual Tour',
            price: '₹12,999',
            duration: '4 Days',
            highlights: [
              'Ganga Aarti ceremony',
              'Temple visits',
              'Boat ride on Ganges',
              'Sarnath exploration',
              'Spiritual discourses',
              'Traditional rituals'
            ]
          }
        }
      }

      // Default blog if ID not found
      const blogData = sampleBlogs[id] || sampleBlogs[1]
      setBlog(blogData)
      setLoading(false)
    }

    if (id) {
      fetchBlog()
    }
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
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
        description={blog.description}
        keywords={`${blog.title}, travel blog, India travel, Safe Hands Travels`}
        image={blog.heroImage}
        url={`/blog/${id}`}
      />
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        {/* Blog Hero Image */}
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${blog.heroImage})`
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

