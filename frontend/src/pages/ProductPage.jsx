import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { tripsAPI, enquiriesAPI, productPageSettingsAPI, blogsAPI } from '../config/api'
import { Loader2, Calendar, Users, Mail, Phone, MessageSquare, Send, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import SEO from '../components/SEO'
import { getTripSchema, getBreadcrumbSchema } from '../utils/structuredData'
import TripCard from '../components/card/TripCard'

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageSettings, setPageSettings] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)
  const [activeTab, setActiveTab] = useState('Itinerary')
  const [numTravelers, setNumTravelers] = useState(1)
  const [selectedDate, setSelectedDate] = useState('Dec 13, 2025')
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedMonth: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [recommendedTrips, setRecommendedTrips] = useState([])
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loadingBlogs, setLoadingBlogs] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tripResponse, settingsResponse] = await Promise.all([
          tripsAPI.getTripById(id),
          productPageSettingsAPI.getSettings()
        ])
        
        const tripData = tripResponse.trip || tripResponse
        console.log('ProductPage - Fetched trip data:', tripData); // Debug log
        console.log('ProductPage - trip.recommendedTrips:', tripData?.recommendedTrips); // Debug log
        console.log('ProductPage - trip.seatsLeft:', tripData?.seatsLeft, 'type:', typeof tripData?.seatsLeft); // Debug log
        setTrip(tripData)
        setPageSettings(settingsResponse.settings)
        
        // Set default tab from settings
        if (settingsResponse.settings?.displaySettings?.defaultTab) {
          setActiveTab(settingsResponse.settings.displaySettings.defaultTab)
        }
        
        // Set default date from settings
        if (settingsResponse.settings?.bookingCard?.defaultDates?.[0]) {
          setSelectedDate(settingsResponse.settings.bookingCard.defaultDates[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load trip details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, toast])

  // Fetch recommended trips
  useEffect(() => {
    const fetchRecommendedTrips = async () => {
      console.log('ProductPage - trip.recommendedTrips:', trip?.recommendedTrips, 'type:', typeof trip?.recommendedTrips); // Debug log
      
      const recommendedTripsIds = Array.isArray(trip?.recommendedTrips) 
        ? trip.recommendedTrips 
        : (trip?.recommendedTrips ? [trip.recommendedTrips] : []);
      
      if (!recommendedTripsIds || recommendedTripsIds.length === 0) {
        console.log('No recommended trips to fetch'); // Debug log
        setRecommendedTrips([])
        return
      }

      console.log('Fetching recommended trips with IDs:', recommendedTripsIds); // Debug log

      try {
        const tripPromises = recommendedTripsIds.map(tripId => 
          tripsAPI.getTripById(tripId).catch(err => {
            console.error(`Error fetching recommended trip ${tripId}:`, err)
            return null
          })
        )
        
        const results = await Promise.all(tripPromises)
        const trips = results
          .filter(result => result && (result.trip || result))
          .map(result => result.trip || result)
          .filter(t => t && t.status === 'active') // Only show active trips
        
        console.log('Fetched recommended trips:', trips.length, trips); // Debug log
        setRecommendedTrips(trips)
      } catch (error) {
        console.error('Error fetching recommended trips:', error)
        setRecommendedTrips([])
      }
    }

    if (trip) {
      fetchRecommendedTrips()
    }
  }, [trip])

  // Fetch related blogs - only show blogs that were explicitly added in admin panel
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        setLoadingBlogs(true)
        
        // Get related blog IDs from trip
        const relatedBlogIds = Array.isArray(trip?.relatedBlogs) 
          ? trip.relatedBlogs 
          : (trip?.relatedBlogs ? [trip.relatedBlogs] : []);
        
        // Only show blogs if they were explicitly added in admin panel
        if (!relatedBlogIds || relatedBlogIds.length === 0) {
          setRelatedBlogs([])
          setLoadingBlogs(false)
          return
        }

        // Fetch blogs by IDs
        const blogPromises = relatedBlogIds.map(blogId => 
          blogsAPI.getBlogById(blogId).catch(err => {
            console.error(`Error fetching related blog ${blogId}:`, err)
            return null
          })
        )
        
        const results = await Promise.all(blogPromises)
        const blogs = results
          .filter(result => result && (result.blog || result))
          .map(result => result.blog || result)
          .filter(blog => blog && (blog.status === 'active' || blog.status === 'published' || !blog.status))
        
        setRelatedBlogs(blogs)
      } catch (error) {
        console.error('Error fetching related blogs:', error)
        setRelatedBlogs([])
      } finally {
        setLoadingBlogs(false)
      }
    }

    if (trip) {
      fetchRelatedBlogs()
    }
  }, [trip])

  // Get all gallery images for lightbox - moved before early returns
  const getAllGalleryImages = useCallback(() => {
    if (!trip) return []
    
    // We'll compute content here or use a safe fallback
    const galleryImages = (trip.gallery && trip.gallery.length > 0) 
      ? trip.gallery 
      : [trip.imageUrl || trip.image].filter(Boolean)
    
    // Include main image if not already in gallery
    const mainImage = trip.imageUrl || trip.image
    if (mainImage && !galleryImages.includes(mainImage)) {
      return [mainImage, ...galleryImages]
    }
    return galleryImages
  }, [trip])

  const handleNextImage = useCallback(() => {
    const allImages = getAllGalleryImages()
    if (allImages.length === 0) return
    setLightboxIndex((prev) => (prev + 1) % allImages.length)
  }, [getAllGalleryImages])

  const handlePreviousImage = useCallback(() => {
    const allImages = getAllGalleryImages()
    if (allImages.length === 0) return
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }, [getAllGalleryImages])

  // Touch handlers for swipe
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNextImage()
    }
    if (isRightSwipe) {
      handlePreviousImage()
    }
  }, [touchStart, touchEnd, handleNextImage, handlePreviousImage])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        handlePreviousImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, handleNextImage, handlePreviousImage])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#017233]" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#017233] text-white rounded-lg hover:bg-[#015a28] transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  // Get content from trip data (now stored in database)
  const getTripContent = (tripData) => {
    const contentMap = {
      'Meghalaya': {
        subtitle: '6 Days Adventure Trip',
        intro: 'Meghalaya, the "Abode of Clouds," offers an unparalleled backpacking experience through lush green valleys, cascading waterfalls, and unique living root bridges. This adventure takes you through some of the most pristine and untouched landscapes in Northeast India, where nature and culture blend seamlessly.',
        video: trip.videoUrl || trip.video || '',
        gallery: trip.gallery || [
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60'
        ],
        reviews: trip.reviews || [
          {
            rating: 5,
            text: 'An amazing experience! The trip was well-organized and the destination exceeded all expectations. Highly recommended!',
            author: 'Recent Traveller'
          }
        ],
        whyVisit: [
          'Scenic landscapes with rolling hills and dense forests',
          'Iconic living root bridges - a UNESCO World Heritage marvel',
          'Majestic waterfalls including Nohkalikai, Seven Sisters, and Elephant Falls',
          'Rich Khasi and Garo tribal culture with warm, welcoming locals',
          'Offbeat caves like Mawsmai and Krem Liat Prah for spelunking',
          'Unique cuisine featuring bamboo shoots, smoked pork, and Jadoh',
          'Pristine lakes like Umiam and Dawki for water activities',
          'Misty mountains and cool climate perfect for trekking'
        ],
        itinerary: [
          {
            day: 'Day 1',
            title: 'Arrival in Shillong',
            activities: 'Arrive at Shillong, check into accommodation. Evening exploration of local markets and Shillong Peak for sunset views. Welcome dinner with local cuisine.'
          },
          {
            day: 'Day 2',
            title: 'Cherrapunji & Living Root Bridges',
            activities: 'Early morning drive to Cherrapunji. Visit Nohkalikai Falls, Seven Sisters Falls, and explore the famous double-decker living root bridge at Nongriat. Moderate trek through lush forests.'
          },
          {
            day: 'Day 3',
            title: 'Mawsmai Caves & Local Villages',
            activities: 'Explore Mawsmai limestone caves. Visit local Khasi villages to experience traditional lifestyle. Afternoon at Wah Kaba Falls. Cultural interaction with locals.'
          },
          {
            day: 'Day 4',
            title: 'Dawki & Umngot River',
            activities: 'Journey to Dawki to witness the crystal-clear Umngot River. Optional boating and cliff jumping. Visit Indo-Bangladesh border. Return to Shillong via scenic routes.'
          },
          {
            day: 'Day 5',
            title: 'Elephant Falls & Local Exploration',
            activities: 'Visit Elephant Falls and Shillong Peak. Explore local markets for handicrafts. Optional visit to Don Bosco Museum for cultural insights. Evening at leisure.'
          },
          {
            day: 'Day 6',
            title: 'Departure',
            activities: 'Breakfast and check-out. Transfer to airport/railway station with memories of Meghalaya\'s natural beauty and cultural richness.'
          }
        ],
        included: [
          'Accommodation in comfortable guesthouses/hotels (twin sharing)',
          'All meals (breakfast, lunch, dinner) as per itinerary',
          'Transportation in private vehicles (AC/non-AC as per group size)',
          'Experienced local guide throughout the trip',
          'Entry fees to monuments, caves, and waterfalls',
          'Permits and permissions for restricted areas',
          'First aid kit and basic medical support',
          'Trip leader assistance'
        ],
        notIncluded: [
          'Transportation to/from Shillong (flights/trains)',
          'Personal expenses and shopping',
          'Extra meals and beverages not mentioned',
          'Optional activities like boating, paragliding',
          'Travel insurance (highly recommended)',
          'Tips and gratuities',
          'Any expenses due to weather or unforeseen circumstances',
          'GST and other taxes'
        ],
        notes: [
          'Arrival: Reach Shillong by flight (Umroi Airport) or train to Guwahati followed by road transfer (3-4 hours)',
          'Departure: Plan departure from Shillong after 12 PM on Day 6',
          'Weather: Meghalaya experiences heavy rainfall. Pack raincoats, waterproof bags, and quick-dry clothing',
          'Fitness: Moderate fitness level required. Day 2 involves a 3-4 hour trek with steep steps',
          'Accommodation: Basic to mid-range guesthouses. Hot water may not be available at all locations',
          'Age restriction: Suitable for ages 12-60. Children below 12 need parental supervision',
          'Safety: Follow guide instructions, especially during treks and cave explorations',
          'Local conditions: Itinerary may change due to weather, road conditions, or local restrictions'
        ],
        faq: [
          {
            question: 'What is the best time to visit Meghalaya?',
            answer: 'The best time is from October to May when the weather is pleasant. Monsoon (June-September) offers lush greenery but heavy rainfall may affect outdoor activities.'
          },
          {
            question: 'How many days are enough for Meghalaya?',
            answer: '6-7 days are ideal to explore the main attractions including Shillong, Cherrapunji, living root bridges, and waterfalls. For a more relaxed trip, 8-10 days would be better.'
          },
          {
            question: 'What is the cost range for this trip?',
            answer: 'The trip costs ₹22,999 per person (excluding transportation to/from Shillong). Additional expenses for personal shopping, optional activities, and tips may apply.'
          },
          {
            question: 'Can the itinerary be customized?',
            answer: 'Yes, we can customize the itinerary based on your preferences, group size, and duration. Contact us for personalized packages.'
          },
          {
            question: 'What is the group size?',
            answer: 'We typically operate with groups of 8-15 people. Smaller groups ensure better experience and personalized attention.'
          },
          {
            question: 'Is Meghalaya safe for solo travelers?',
            answer: 'Yes, Meghalaya is generally safe. However, we recommend joining group trips for better experience and safety, especially for first-time visitors.'
          }
        ]
      },
      'Spiti Valley': {
        subtitle: '7 Days Winter Expedition',
        intro: 'Spiti Valley, often called "Little Tibet," is a high-altitude desert valley that transforms into a winter wonderland. This expedition takes you through snow-clad mountains, ancient monasteries, and remote villages, offering an authentic Himalayan experience in one of India\'s most pristine regions.',
        video: trip.videoUrl || trip.video || '',
        gallery: trip.gallery || [
          'https://images.unsplash.com/photo-1523906630133-f6934a1ab6c8?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=60'
        ],
        reviews: trip.reviews || [
          {
            rating: 5,
            text: 'An amazing experience! The trip was well-organized and the destination exceeded all expectations. Highly recommended!',
            author: 'Recent Traveller'
          }
        ],
        whyVisit: [
          'Breathtaking snow-covered landscapes and frozen rivers',
          'Ancient Buddhist monasteries like Key, Tabo, and Dhankar',
          'Stargazing opportunities in one of India\'s darkest skies',
          'Unique high-altitude desert ecosystem',
          'Warm hospitality of Spitian locals',
          'Adventure activities like snow trekking and ice climbing',
          'Photography paradise with dramatic mountain vistas',
          'Cultural immersion in Tibetan-influenced traditions'
        ],
        itinerary: [
          {
            day: 'Day 1',
            title: 'Arrival in Manali',
            activities: 'Arrive in Manali, acclimatization day. Briefing session about the expedition. Explore local markets and prepare for the journey ahead.'
          },
          {
            day: 'Day 2',
            title: 'Manali to Kaza via Rohtang',
            activities: 'Early morning departure to Kaza (200 km, 8-10 hours). Cross Rohtang Pass (subject to weather). En route visit Key Monastery. Check into guesthouse in Kaza.'
          },
          {
            day: 'Day 3',
            title: 'Kaza - Langza - Hikkim - Komic',
            activities: 'Visit the world\'s highest post office in Hikkim. Explore fossil village Langza and highest motorable village Komic. Return to Kaza for overnight stay.'
          },
          {
            day: 'Day 4',
            title: 'Kaza - Tabo - Dhankar',
            activities: 'Visit ancient Tabo Monastery (1000+ years old). Explore Dhankar Monastery perched on a cliff. Witness stunning views of Spiti River confluence.'
          },
          {
            day: 'Day 5',
            title: 'Kaza - Pin Valley - Mud Village',
            activities: 'Excursion to Pin Valley National Park. Visit Mud Village and experience local life. Optional snow activities. Return to Kaza.'
          },
          {
            day: 'Day 6',
            title: 'Kaza to Manali',
            activities: 'Early morning departure from Kaza. Cross Rohtang Pass again. Arrive in Manali by evening. Farewell dinner and trip conclusion.'
          },
          {
            day: 'Day 7',
            title: 'Departure',
            activities: 'Breakfast and check-out. Transfer to airport/bus stand. End of expedition with unforgettable memories.'
          }
        ],
        included: [
          'Accommodation in guesthouses/homestays (twin sharing)',
          'All meals (vegetarian meals, local cuisine)',
          'Transportation in 4x4 vehicles suitable for mountain terrain',
          'Experienced local guide and driver',
          'Monastery entry fees and permits',
          'Inner Line Permits for Spiti Valley',
          'First aid kit and oxygen cylinders',
          'Trip leader support'
        ],
        notIncluded: [
          'Transportation to/from Manali',
          'Personal expenses and shopping',
          'Extra meals and beverages',
          'Optional activities and equipment rental',
          'Travel insurance (mandatory)',
          'Tips and gratuities',
          'Expenses due to road closures or weather',
          'GST and taxes'
        ],
        notes: [
          'Arrival: Reach Manali by bus from Delhi/Chandigarh or flight to Bhuntar Airport',
          'Departure: Plan departure from Manali after 10 AM on Day 7',
          'Altitude: Spiti is at 12,500+ feet. Acclimatization is crucial. Those with heart/lung conditions should consult a doctor',
          'Weather: Extreme cold (-10°C to -20°C). Carry heavy woolens, thermal wear, gloves, and proper winter gear',
          'Fitness: Good physical fitness required. Some walking at high altitudes involved',
          'Age restriction: Recommended for ages 18-55. Not suitable for children or elderly',
          'Road conditions: Roads may be blocked due to snow. Itinerary subject to weather and road conditions',
          'Accommodation: Basic facilities. Hot water and heating may be limited. No luxury hotels in Spiti'
        ],
        faq: [
          {
            question: 'What is the best time to visit Spiti Valley?',
            answer: 'Winter (December-February) for snow experience, or summer (May-October) for easier access. Winter expeditions are more challenging but offer unique experiences.'
          },
          {
            question: 'How many days are enough for Spiti Valley?',
            answer: '7-8 days are ideal for a comprehensive Spiti experience. Shorter trips (5-6 days) are possible but rushed.'
          },
          {
            question: 'What is the cost range?',
            answer: 'The winter expedition costs ₹18,999 per person. Additional costs for transportation to Manali, travel insurance, and personal expenses.'
          },
          {
            question: 'Is Spiti Valley safe in winter?',
            answer: 'Yes, with proper preparation and experienced guides. However, weather can be unpredictable. Travel insurance and proper gear are essential.'
          },
          {
            question: 'What is the group size?',
            answer: 'Groups of 6-12 people for better vehicle management and personalized experience in challenging conditions.'
          },
          {
            question: 'Do I need special permits?',
            answer: 'Yes, Inner Line Permits are required for Spiti Valley. We arrange these as part of the package.'
          }
        ]
      }
    }

    // Default content for other locations
    const defaultContent = {
      subtitle: `${trip.duration} Adventure Trip`,
      intro: `${trip.location} offers an incredible backpacking experience with stunning natural beauty, rich culture, and unique adventures. This carefully curated trip takes you through the best that this destination has to offer, ensuring an unforgettable journey filled with memories.`,
      video: trip.video || '/video/Slider.mp4',
      gallery: trip.gallery || [
        trip.image,
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=60'
      ],
      reviews: trip.reviews || [
        {
          rating: 5,
          text: 'An amazing experience! The trip was well-organized and the destination exceeded all expectations. Highly recommended!',
          author: 'Recent Traveller'
        }
      ],
      whyVisit: [
        'Scenic landscapes and natural beauty',
        'Rich cultural heritage and local traditions',
        'Unique experiences and offbeat locations',
        'Friendly locals and warm hospitality',
        'Delicious local cuisine',
        'Adventure activities and outdoor experiences',
        'Photography opportunities',
        'Peaceful and rejuvenating environment'
      ],
      itinerary: Array.from({ length: parseInt(trip.duration) }, (_, i) => ({
        day: `Day ${i + 1}`,
        title: i === 0 ? 'Arrival' : i === parseInt(trip.duration) - 1 ? 'Departure' : 'Exploration Day',
        activities: i === 0 
          ? 'Arrive at destination, check into accommodation. Brief orientation and welcome dinner.'
          : i === parseInt(trip.duration) - 1
          ? 'Breakfast and check-out. Transfer to departure point with wonderful memories.'
          : `Full day of exploration including key attractions, local experiences, and cultural immersion.`
      })),
      included: [
        'Accommodation (twin sharing)',
        'All meals as per itinerary',
        'Transportation during the trip',
        'Experienced local guide',
        'Entry fees to monuments and attractions',
        'Basic first aid support',
        'Trip leader assistance'
      ],
      notIncluded: [
        'Transportation to/from destination',
        'Personal expenses and shopping',
        'Extra meals and beverages',
        'Optional activities',
        'Travel insurance',
        'Tips and gratuities',
        'GST and taxes'
      ],
      notes: [
        'Arrival: Please reach the starting point as per the itinerary',
        'Departure: Plan your departure after the trip concludes',
        'Weather: Check weather conditions and pack accordingly',
        'Fitness: Moderate fitness level recommended',
        'Accommodation: Basic to mid-range facilities',
        'Safety: Follow guide instructions at all times',
        'Local conditions: Itinerary may change due to weather or local restrictions'
      ],
      faq: [
        {
          question: 'What is the best time to visit?',
          answer: 'The destination is best visited during the recommended months for optimal weather and experiences.'
        },
        {
          question: 'How many days are enough?',
          answer: `The ${trip.duration} trip is well-planned to cover major attractions. Extended stays can be arranged upon request.`
        },
        {
          question: 'What is the cost range?',
          answer: trip.price 
            ? `The trip costs ${trip.price} per person. Additional expenses for transportation, personal shopping, and optional activities apply.`
            : 'Please contact us for pricing details. Additional expenses for transportation, personal shopping, and optional activities apply.'
        },
        {
          question: 'Can the itinerary be customized?',
          answer: 'Yes, we offer customized itineraries based on your preferences, group size, and duration. Contact us for details.'
        },
        {
          question: 'What is the group size?',
          answer: 'We typically operate with groups of 8-15 people to ensure personalized attention and better experience.'
        },
        {
          question: 'Is it safe for solo travelers?',
          answer: 'Yes, the destination is safe. We recommend joining group trips for better experience and safety.'
        }
      ]
    }

    // If trip has all content fields, use them directly
    if (tripData.intro && tripData.whyVisit && tripData.itinerary) {
      return {
        subtitle: tripData.subtitle || `${tripData.duration} Adventure Trip`,
        intro: tripData.intro,
        video: tripData.videoUrl || tripData.video || '/video/Slider.mp4',
        gallery: tripData.gallery && tripData.gallery.length > 0 ? tripData.gallery : [
          tripData.imageUrl || tripData.image,
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=60'
        ],
        reviews: tripData.reviews && tripData.reviews.length > 0 ? tripData.reviews : [
          {
            rating: 5,
            text: 'An amazing experience! The trip was well-organized and the destination exceeded all expectations. Highly recommended!',
            author: 'Recent Traveller'
          }
        ],
        whyVisit: tripData.whyVisit || [],
        itinerary: tripData.itinerary || [],
        included: tripData.included || [],
        notIncluded: tripData.notIncluded || [],
        notes: tripData.notes || [],
        faq: tripData.faq || [],
      }
    }

    // Fallback to location-based content for backward compatibility
    return contentMap[tripData.location] || defaultContent
  }

  const content = getTripContent(trip)

  // SEO metadata
  const tripTitle = trip ? `${trip.title} - ${trip.location} | Safe Hands Travels` : 'Trip Details | Safe Hands Travels'
  const tripDescription = trip 
    ? (trip.intro || content.intro || `Experience ${trip.title} in ${trip.location}. ${trip.duration} adventure trip with Safe Hands Travels.`)
    : 'Discover amazing travel experiences with Safe Hands Travels'
  const tripImage = trip ? (trip.imageUrl || trip.image || '/images/Logo.webp') : '/images/Logo.webp'
  const tripUrl = trip ? `/trip/${trip.id}` : ''
  
  // Structured data
  const structuredData = trip ? [
    getTripSchema(trip),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Trips', url: '/all-india-trips' },
      { name: trip.title, url: tripUrl }
    ])
  ].filter(Boolean) : null


  const validateEnquiryForm = () => {
    const newErrors = {};
    
    if (!enquiryData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!enquiryData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!enquiryData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
      if (!phoneRegex.test(enquiryData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEnquiryForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const monthName = enquiryData.selectedMonth 
        ? new Date(enquiryData.selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : selectedDate || 'Not specified';

      await enquiriesAPI.createEnquiry({
        tripId: trip.id,
        tripTitle: trip.title,
        tripLocation: trip.location,
        tripPrice: trip.price,
        selectedMonth: monthName,
        numberOfTravelers: numTravelers,
        name: enquiryData.name.trim(),
        email: enquiryData.email.trim(),
        phone: enquiryData.phone.trim(),
        message: enquiryData.message.trim() || null,
      });

      setSubmitted(true);
      toast.success('Thank you! Your enquiry has been submitted successfully. We\'ll get back to you soon.');
      setTimeout(() => {
        setShowEnquiryForm(false);
        setSubmitted(false);
        setEnquiryData({
          name: '',
          email: '',
          phone: '',
          message: '',
          selectedMonth: ''
        });
        // Redirect to home page
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error(error.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnquiryInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      {trip && (
        <>
          <SEO
            title={tripTitle}
            description={tripDescription}
            keywords={`${trip.title}, ${trip.location}, travel, trip, adventure, ${trip.duration}, Safe Hands Travels, India travel`}
            image={tripImage}
            url={tripUrl}
            type="article"
            structuredData={structuredData}
          />
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
        {/* Hero Section with Split Image Layout */}
        {pageSettings?.sections?.find(s => s.id === 'hero')?.enabled && (
        <div className="relative w-full bg-gray-50 py-8 md:py-12">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            {(() => {
              // Get hero images for slider - use trip.heroImages if available, otherwise fallback to gallery
              const getHeroImages = () => {
                // First priority: use heroImages if available
                if (trip.heroImages && trip.heroImages.length > 0) {
                  return trip.heroImages
                }
                // Second priority: use content.gallery if available
                if (content && content.gallery && content.gallery.length > 0) {
                  const galleryImages = content.gallery
                  const mainImage = trip.imageUrl || trip.image
                  if (mainImage && !galleryImages.includes(mainImage)) {
                    return [mainImage, ...galleryImages]
                  }
                  return galleryImages
                }
                // Fallback: use getAllGalleryImages
                return getAllGalleryImages()
              }
              const heroImages = getHeroImages()
              const totalImages = heroImages.length
              const hasMoreThanFive = totalImages > 5
              const remainingImages = hasMoreThanFive ? totalImages - 5 : 0
              
              // Get images to display: first 5 images
              const imagesToDisplay = heroImages.slice(0, 5)
              
              return (
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 h-auto lg:h-[70vh]">
                  {/* Large Image on Left (50%) - Desktop, First Image - Mobile */}
                  <div 
                    className="w-full lg:w-1/2 h-[40vh] sm:h-[50vh] lg:h-full relative group cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(0)
                      setLightboxOpen(true)
                    }}
                  >
                    <div className="relative w-full h-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                      <img 
                        src={imagesToDisplay[0] || trip.imageUrl || trip.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60'} 
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      {/* Overlay with title */}
                      <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-8 pointer-events-none">
                        <div className="text-white">
                          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2 drop-shadow-2xl tracking-tight">
                            {trip.title}
                          </h1>
                          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light drop-shadow-lg opacity-95">
                            {trip.location} {content.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Four Smaller Images on Right (25% each in 2x2 grid) - Desktop, Stacked - Mobile */}
                  <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-auto lg:h-full">
                    {imagesToDisplay.slice(1, 5).map((image, index) => {
                      const actualIndex = index + 1 // Index 1-4 in the full gallery
                      const isFifthImage = index === 3 && hasMoreThanFive // 4th in this slice = 5th overall
                      
                      return (
                        <div 
                          key={actualIndex}
                          className="relative h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-full group overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                          onClick={() => {
                            setLightboxIndex(actualIndex)
                            setLightboxOpen(true)
                          }}
                        >
                          <img 
                            src={image} 
                            alt={`${trip.title} gallery ${actualIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* +X Overlay on 5th image if more than 5 images */}
                          {isFifthImage && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/50 cursor-pointer">
                              <div className="text-center">
                                <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-2xl">
                                  +{remainingImages}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
            
            {/* Trip Info Badges */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm md:text-base">
              <span className="bg-white backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-gray-200 text-gray-800 font-medium">
                ⏱️ {trip.duration}
              </span>
              <span className="bg-white backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-gray-200 text-gray-800 font-medium">
                📍 {trip.location}
              </span>
            </div>
            
            {/* Scroll indicator */}
            <div className="mt-8 flex justify-center">
              <div >
                <div className="w-1 h-3  rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        )}

      {/* Main Content with Sidebar */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                {/* Trip Title */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {trip.title}
                  </h2>
                  {pageSettings?.sections?.find(s => s.id === 'intro')?.enabled && (
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                    {content.intro}
                  </p>
                  )}
                </div>

                {/* All Sections - Single Vertical Scroll Layout */}
                <div className="space-y-8">
                  {/* Itinerary Section */}
                  {pageSettings?.tabs?.find(t => t.id === 'itinerary')?.enabled && (
                    <section className="bg-gradient-to-br from-[#017233]/5 to-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border border-[#017233]/10">
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0">
                          📅
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                          Itinerary Breakdown
                        </h2>
                      </div>
              <div className="space-y-3">
                {content.itinerary.map((day, index) => {
                  const isExpanded = pageSettings?.displaySettings?.autoExpandItinerary ? true : expandedDay === index
                  // Split activities into points (by periods, then filter empty strings)
                  const activitiesPoints = typeof day.activities === 'string' 
                    ? day.activities.split(/[.!?]+/).filter(point => point.trim().length > 0).map(p => p.trim())
                    : Array.isArray(day.activities) 
                    ? day.activities 
                    : [day.activities]
                  
                  return (
                    <div 
                      key={index} 
                      className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200"
                    >
                      {/* Clickable Header */}
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : index)}
                        className="w-full flex items-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 py-3 sm:py-4 md:py-5 text-left cursor-pointer focus:outline-none rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-md">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                              <span className="text-[#017233]">{day.day}:</span> {day.title}
                            </h3>
                          </div>
                          <div className="flex-shrink-0">
                            <svg
                              className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#017233]' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Collapsible Content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 pb-5 pl-20">
                          <ul className="space-y-2.5">
                            {activitiesPoints.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#017233] mt-2.5"></div>
                                <span className="text-gray-700 leading-relaxed text-sm md:text-base">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                    })}
                    </div>
                  </section>
                  )}

                  {/* Inclusion/Exclusion Section */}
                  {pageSettings?.tabs?.find(t => t.id === 'inclusion')?.enabled && (
                    <div className="flex flex-col gap-4 sm:gap-6">
              <section className="bg-gradient-to-br from-[#017233]/5 to-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-[#017233]/10">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                    ✓
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">What's Included</h2>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {content.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3 group">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#017233] text-white text-xs sm:text-sm flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">✓</span>
                      <span className="text-gray-700 leading-relaxed text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                    ✗
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">What's Not Included</h2>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {content.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3 group">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-500 text-white text-xs sm:text-sm flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">✗</span>
                      <span className="text-gray-700 leading-relaxed text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                    </section>
                    </div>
                  )}

                  {/* Notes Section */}
                  {pageSettings?.tabs?.find(t => t.id === 'notes')?.enabled && (
                    <section className="bg-gradient-to-br from-[#017233]/5 via-white to-[#01994d]/5 border-l-4 border-[#017233] rounded-2xl shadow-lg p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  ⚠
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Notes / Important Information</h2>
              </div>
              <ul className="space-y-4">
                {content.notes.map((note, index) => (
                  <li key={index} className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 group hover:bg-white transition-colors border border-[#017233]/10">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] text-white text-sm flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform font-bold">⚠</span>
                    <span className="text-gray-800 leading-relaxed text-base">{note}</span>
                  </li>
                    ))}
                    </ul>
                  </section>
                  )}

                  {/* Date & Costing Section */}
                  {pageSettings?.tabs?.find(t => t.id === 'costing')?.enabled && (
                    <section className="bg-gradient-to-br from-[#017233]/5 to-white rounded-2xl shadow-lg p-8 md:p-10 border border-[#017233]/10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          💰
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                          Pricing & Dates
                        </h2>
                      </div>
                      <div className="space-y-6">
                        {trip.price && (
                          <div className="bg-white rounded-xl p-6 shadow-md">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Pricing</h3>
                            <div className="flex items-baseline gap-3">
                              <span className="text-4xl font-bold text-[#017233]">{trip.price}</span>
                              {trip.oldPrice && (
                                <>
                                  <span className="text-xl text-gray-400 line-through">{trip.oldPrice}</span>
                                  <span className="text-sm text-red-600 font-semibold">₹ 2,000 Off</span>
                                </>
                              )}
                            </div>
                            <p className="text-gray-600 mt-2">Per Person</p>
                          </div>
                        )}
                        <div className="bg-white rounded-xl p-6 shadow-md">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Available Dates</h3>
                          <p className="text-gray-700">Contact us for available dates and group bookings.</p>
                        </div>
                      </div>
                    </section>
                  )}


                  {/* Gallery Section */}
                  {pageSettings?.sections?.find(s => s.id === 'gallery')?.enabled && (
                  <section className="bg-gradient-to-br from-[#017233]/5 to-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border border-[#017233]/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0">
                  📸
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Gallery & Traveller Experiences
                </h2>
              </div>
              <div className={`grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 ${
                pageSettings?.displaySettings?.galleryColumns === 3 ? 'md:grid-cols-3' :
                pageSettings?.displaySettings?.galleryColumns === 2 ? 'md:grid-cols-2' :
                'md:grid-cols-4'
              }`}>
                {(() => {
                  // Get gallery images (exclude hero images to avoid duplicates)
                  const getGalleryImages = () => {
                    if (content && content.gallery && content.gallery.length > 0) {
                      return content.gallery
                    }
                    return getAllGalleryImages()
                  }
                  const galleryImages = getGalleryImages()
                  
                  return galleryImages.map((image, index) => {
                    // Calculate the correct index in the full gallery for lightbox
                    const getImagesForLightbox = () => {
                      // For lightbox, combine hero images and gallery images
                      const heroImages = trip.heroImages && trip.heroImages.length > 0 ? trip.heroImages : []
                      const galleryImages = content && content.gallery && content.gallery.length > 0 
                        ? content.gallery 
                        : getAllGalleryImages()
                      
                      // Combine hero images first, then gallery images (avoid duplicates)
                      const allImages = [...heroImages]
                      galleryImages.forEach(img => {
                        if (!allImages.includes(img)) {
                          allImages.push(img)
                        }
                      })
                      
                      return allImages
                    }
                    
                    return (
                      <div 
                        key={index} 
                        className="aspect-square rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group relative cursor-pointer"
                        onClick={() => {
                          // Get all images for lightbox
                          const allImages = getImagesForLightbox()
                          // Find the index of this specific image in the full gallery
                          let imageIndex = allImages.findIndex(img => img === image)
                          // If not found, use the index from gallery
                          if (imageIndex === -1) {
                            // Start index after hero images
                            const heroImages = trip.heroImages && trip.heroImages.length > 0 ? trip.heroImages : []
                            imageIndex = heroImages.length + index
                          }
                          // Ensure index is valid
                          if (imageIndex >= 0 && imageIndex < allImages.length) {
                            setLightboxIndex(imageIndex)
                            setLightboxOpen(true)
                          }
                        }}
                      >
                        <img 
                          src={image} 
                          alt={`${trip.title} gallery ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#017233]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    )
                  })
                })()}
              </div>
            </section>
            )}

            {/* Reviews Section - Separated from Gallery for visibility */}
            {(pageSettings?.sections?.find(s => s.id === 'gallery')?.enabled || pageSettings?.sections?.find(s => s.id === 'reviews')?.enabled) && (
            <section className="bg-gradient-to-br from-[#017233]/5 to-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border border-[#017233]/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0">
                  ★
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Traveller Reviews
                </h2>
              </div>

              {content.reviews && content.reviews.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {content.reviews
                    .slice(0, pageSettings?.displaySettings?.maxReviewsDisplay || 10)
                    .map((review, index) => (
                    <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex gap-1 mb-2 sm:mb-3">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-base sm:text-lg md:text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <p className="text-gray-700 italic text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">"{review.text}"</p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs sm:text-sm">
                          {review.author.charAt(0)}
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">{review.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-sm sm:text-base text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </section>
            )}

            {/* FAQ Section Card */}
            {pageSettings?.sections?.find(s => s.id === 'faq')?.enabled && (
            <section className="bg-gradient-to-br from-[#017233]/5 to-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border border-[#017233]/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0">
                  ❓
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {content.faq.map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white font-bold text-xs sm:text-sm group-hover:scale-110 transition-transform">
                        Q
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#017233] transition-colors">
                          {faq.question}
                        </h3>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-[#017233] font-bold mt-0.5 sm:mt-1 text-sm sm:text-base">A:</span>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}

                </div>
              </div>
            </div>
          </div>

          {/* Fixed Booking Sidebar */}
          {pageSettings?.bookingCard?.enabled && (
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {/* Trip Starts From */}
                  {pageSettings?.bookingCard?.showPrice && trip.price && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-3">Trip Starts From</h3>
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#017233]">{trip.price}</span>
                      {trip.oldPrice && pageSettings?.displaySettings?.showOldPrice && (
                        <>
                          <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through">{trip.oldPrice}</span>
                          {pageSettings?.displaySettings?.showDiscountBadge && (
                            <span className="text-xs sm:text-sm text-red-600 font-semibold">₹ 2,000 Off</span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Per Person</p>
                  </div>
                  )}

                  {/* Trip Dates */}
                  {pageSettings?.bookingCard?.showDates && (
                  <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      Select Travel Date
                    </h3>
                    <div className="mb-3">
                      <input
                        type="date"
                        value={(() => {
                          // Convert selectedDate (e.g., "Dec 13, 2025") to YYYY-MM-DD format
                          if (selectedDate && selectedDate.includes(',')) {
                            try {
                              const date = new Date(selectedDate)
                              if (!isNaN(date.getTime())) {
                                return date.toISOString().split('T')[0]
                              }
                            } catch (e) {
                              // If conversion fails, use today's date
                            }
                          }
                          // If it's already in YYYY-MM-DD format, use it
                          if (selectedDate && selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            return selectedDate
                          }
                          // Default to today or first available date
                          const defaultDates = pageSettings?.bookingCard?.defaultDates || []
                          if (defaultDates.length > 0) {
                            try {
                              const date = new Date(defaultDates[0])
                              if (!isNaN(date.getTime())) {
                                return date.toISOString().split('T')[0]
                              }
                            } catch (e) {}
                          }
                          // Fallback to today
                          return new Date().toISOString().split('T')[0]
                        })()}
                        onChange={(e) => {
                          const dateValue = e.target.value
                          if (dateValue) {
                            // Convert YYYY-MM-DD to readable format
                            const date = new Date(dateValue)
                            const formattedDate = date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                            setSelectedDate(formattedDate)
                          }
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-[#017233] focus:ring-2 focus:ring-[#017233]/20 outline-none text-sm sm:text-base text-gray-900 font-medium cursor-pointer hover:border-[#017233]/50 transition-colors"
                        style={{
                          colorScheme: 'light'
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between bg-gradient-to-r from-[#017233]/5 to-[#01994d]/5 rounded-lg p-3 sm:p-4 border border-[#017233]/20">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedDate}</p>
                        {trip.price && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Starting from {trip.price} /Person</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white shadow-md">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Available Dates List (Optional) */}
                    {pageSettings?.bookingCard?.defaultDates && pageSettings.bookingCard.defaultDates.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Other available dates:</p>
                        <div className="flex flex-wrap gap-2">
                          {pageSettings.bookingCard.defaultDates.slice(0, 3).map((date, index) => {
                            // Convert date string to YYYY-MM-DD if needed
                            let dateValue = date
                            if (date.includes(',')) {
                              try {
                                const d = new Date(date)
                                if (!isNaN(d.getTime())) {
                                  dateValue = d.toISOString().split('T')[0]
                                }
                              } catch (e) {}
                            }
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  const d = new Date(dateValue)
                                  const formattedDate = d.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })
                                  setSelectedDate(formattedDate)
                                }}
                                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-[#017233] hover:text-white rounded-full transition-colors text-gray-700 font-medium"
                              >
                                {date}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* No. of Travellers */}
                  {pageSettings?.bookingCard?.showTravelers && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      No. of Travellers
                    </h3>
                    <div className="flex items-center gap-4">
                    <button
                      onClick={() => setNumTravelers(Math.max(pageSettings?.bookingCard?.minTravelers || 1, numTravelers - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#017233] hover:bg-[#017233] hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-2xl font-bold text-gray-900 w-12 text-center">{numTravelers}</span>
                      <button
                        onClick={() => setNumTravelers(Math.min(pageSettings?.bookingCard?.maxTravelers || 20, numTravelers + 1))}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#017233] hover:bg-[#017233] hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      // Check if seatsLeft is set (not null, undefined, or empty string)
                      const seatsLeftValue = trip.seatsLeft;
                      const hasSeatsLeft = seatsLeftValue !== null && seatsLeftValue !== undefined && seatsLeftValue !== '';
                      
                      if (!hasSeatsLeft) return null;
                      
                      const seats = typeof seatsLeftValue === 'number' ? seatsLeftValue : parseInt(seatsLeftValue);
                      
                      // Only show if seats is a valid number (including 0)
                      if (isNaN(seats)) return null;
                      
                      return (
                        <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                          <p className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {seats > 0 ? (
                              <>Only <span className="font-bold text-orange-900">{seats}</span> {seats === 1 ? 'seat' : 'seats'} left!</>
                            ) : (
                              <>No seats available</>
                            )}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  )}

                  {/* Send Enquiry Button */}
                  {pageSettings?.bookingCard?.showEnquiryButton && (
                  <button 
                    onClick={() => {
                      setEnquiryData({
                        name: '',
                        email: '',
                        phone: '',
                        message: '',
                        selectedMonth: selectedDate
                      })
                      setErrors({})
                      setSubmitted(false)
                      setShowEnquiryForm(true)
                    }}
                    className="w-full bg-gradient-to-br from-[#017233] to-[#01994d] text-white px-6 py-4 rounded-xl font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg mb-4"
                  >
                    Send Enquiry
                  </button>
                  )}

                  {/* WhatsApp Contact */}
                  {pageSettings?.bookingCard?.showWhatsApp && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Any Doubt?</p>
                    <a
                      href={`https://wa.me/${(pageSettings?.bookingCard?.whatsappNumber || '+918448801998').replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-2 text-[#017233] font-semibold hover:text-[#01994d] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.282 1.262.457 1.694.585.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

        </div>
      </div>
      </div>

      {/* Related Trips Section - Full Width */}
      {recommendedTrips && recommendedTrips.length > 0 && (
        <section className="w-full bg-gradient-to-br from-gray-50 to-white pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8 mt-8 sm:mt-12">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-8 md:mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                  ✨
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Related Trips
                </h2>
              </div>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Discover more amazing destinations that you might love
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              {recommendedTrips.map((recommendedTrip) => (
                <TripCard key={recommendedTrip.id} trip={recommendedTrip} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Blogs Section - Full Width */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="w-full bg-gradient-to-br from-gray-50 to-white pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 md:pb-16 -mt-2 sm:-mt-4">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-8 md:mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">
                  📝
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Related Blogs
                </h2>
              </div>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Explore travel stories and experiences from our journeys
              </p>
            </div>

            {loadingBlogs ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#017233]" />
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
                {relatedBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.id}`}
                    className="group relative flex flex-col h-full w-full min-h-[400px] sm:min-h-[420px] overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200/50 transition-all duration-300 hover:border-[#017233]/50 hover:shadow-[0_20px_50px_rgba(1,114,51,0.3)] cursor-pointer bg-white"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden flex-shrink-0">
                      <img 
                        src={blog.heroImage || blog.imageUrl || blog.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=60'} 
                        alt={blog.title} 
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {blog.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-gradient-to-br from-[#017233] to-[#01994d] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                          {blog.category}
                        </span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col gap-2 p-4 sm:p-5 flex-1 flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[#017233] transition-colors">
                        {blog.title}
                      </h3>
                      {blog.description && (
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-3 flex-1">
                          {blog.description}
                        </p>
                      )}
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        {blog.createdAt && (
                          <span className="text-xs sm:text-sm text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        )}
                        <span className="text-[#017233] font-semibold text-sm sm:text-base group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Read More
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Send Enquiry</h2>
              <button
                onClick={() => {
                  setShowEnquiryForm(false);
                  setSubmitted(false);
                  setErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Submitted!</h3>
                <p className="text-gray-600">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={enquiryData.name}
                    onChange={handleEnquiryInputChange}
                    required
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-[#017233] outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={enquiryData.email}
                    onChange={handleEnquiryInputChange}
                    required
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-[#017233] outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={enquiryData.phone}
                    onChange={handleEnquiryInputChange}
                    required
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-[#017233] outline-none ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Travel Month
                  </label>
                  <input
                    type="month"
                    name="selectedMonth"
                    value={enquiryData.selectedMonth}
                    onChange={handleEnquiryInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-[#017233] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setNumTravelers(Math.max(pageSettings?.bookingCard?.minTravelers || 1, numTravelers - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#017233] hover:bg-[#017233] hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-2xl font-bold text-gray-900 w-12 text-center">{numTravelers}</span>
                    <button
                      type="button"
                      onClick={() => setNumTravelers(Math.min(pageSettings?.bookingCard?.maxTravelers || 20, numTravelers + 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#017233] hover:bg-[#017233] hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={enquiryData.message}
                    onChange={handleEnquiryInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#017233] focus:border-[#017233] outline-none"
                    placeholder="Any specific requirements or questions? (optional)"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-br from-[#017233] to-[#01994d] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Enquiry
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEnquiryForm(false);
                      setErrors({});
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox Gallery */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxOpen(false)
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePreviousImage()
            }}
            className="absolute left-4 md:left-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
            className="absolute right-4 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Image Container with Swipe Support */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              // Combine hero images and gallery images for lightbox
              const getImagesForLightbox = () => {
                const heroImages = trip.heroImages && trip.heroImages.length > 0 ? trip.heroImages : []
                const galleryImages = content && content.gallery && content.gallery.length > 0 
                  ? content.gallery 
                  : getAllGalleryImages()
                
                // Combine hero images first, then gallery images (avoid duplicates)
                const allImages = [...heroImages]
                galleryImages.forEach(img => {
                  if (!allImages.includes(img)) {
                    allImages.push(img)
                  }
                })
                
                return allImages
              }
              const allImages = getImagesForLightbox()
              const currentImage = allImages[lightboxIndex]
              
              return (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  {/* Main Image */}
                  <img
                    src={currentImage}
                    alt={`${trip.title} gallery image ${lightboxIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  />
                  
                  {/* Image Counter */}
                  <div className="mt-4 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
                    <p className="text-white text-sm md:text-base font-medium">
                      {lightboxIndex + 1} / {allImages.length}
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Keyboard Navigation Hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <p className="text-white text-xs md:text-sm opacity-75">
              Use arrow keys or swipe to navigate • ESC to close
            </p>
          </div>
        </div>
      )}
        </>
      )}
    </>
  )
}

export default ProductPage

