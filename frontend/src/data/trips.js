export const trips = [
  {
    id: 1,
    title: 'Living Root Bridges & Caves',
    location: 'Meghalaya',
    duration: '6 days',
    nights: '5 nights',
    month: 'December 2024',
    price: '₹22,999',
    oldPrice: '₹24,999',
    discount: '₹2,000 Off',
    departures: ['Nov 29', 'Dec 6', 'Dec 13'],
    freebies: true,
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=60'
  },
  {
    id: 2,
    title: 'White Spiti Winter Expedition',
    location: 'Spiti Valley',
    duration: '7 days',
    nights: '6 nights',
    month: 'January 2025',
    price: '₹18,999',
    oldPrice: '₹20,999',
    discount: '₹2,000 Off',
    departures: ['Nov 29', 'Dec 6', 'Dec 13', 'Jan 3', 'Jan 10'],
    freebies: true,
    image:
      'https://images.unsplash.com/photo-1523906630133-f6934a1ab6c8?auto=format&fit=crop&w=900&q=60'
  },
  {
    id: 3,
    title: 'Riverside Retreat & Treks',
    location: 'Tirthan Valley',
    duration: '4 days',
    nights: '3 nights',
    month: 'November 2024',
    price: '₹18,499',
    oldPrice: '₹19,999',
    discount: '₹1,500 Off',
    departures: ['Nov 22', 'Nov 29', 'Dec 6'],
    freebies: false,
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60'
  },
  {
    id: 4,
    title: 'Paragliding & Peaks',
    location: 'Himachal Pradesh',
    duration: '5 days',
    nights: '4 nights',
    month: 'March 2025',
    price: '₹21,999',
    oldPrice: '₹23,999',
    discount: '₹2,000 Off',
    departures: ['Dec 20', 'Dec 27', 'Jan 3'],
    freebies: true,
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=60'
  },
  {
    id: 5,
    title: 'Toy Train & Colonial Charm',
    location: 'Shimla',
    duration: '3 days',
    nights: '2 nights',
    month: 'February 2025',
    price: '₹16,499',
    oldPrice: '₹17,999',
    discount: '₹1,500 Off',
    departures: ['Feb 7', 'Feb 14', 'Feb 21'],
    freebies: false,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60'
  },
  {
    id: 6,
    title: 'Ghats & Ganga Aarti Experience',
    location: 'Varanasi',
    duration: '2 days',
    nights: '1 night',
    month: 'January 2025',
    price: '₹14,999',
    oldPrice: '₹15,999',
    discount: '₹1,000 Off',
    departures: ['Jan 5', 'Jan 12', 'Jan 19'],
    freebies: false,
    image:
      'https://images.unsplash.com/photo-1504351873408-0b3fb7ba72d0?auto=format&fit=crop&w=900&q=60'
  },
  {
    id: 7,
    title: 'Yoga by the Ganges',
    location: 'Rishikesh',
    duration: '3 days',
    nights: '2 nights',
    month: 'April 2025',
    price: '₹17,999',
    oldPrice: '₹19,499',
    discount: '₹1,500 Off',
    departures: ['Apr 4', 'Apr 11', 'Apr 18'],
    freebies: true,
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=60'
  },
  {
    id: 8,
    title: 'Backwater Houseboat Escape',
    location: 'Kerala Backwaters',
    duration: '4 days',
    nights: '3 nights',
    month: 'December 2024',
    price: '₹23,999',
    oldPrice: '₹25,999',
    discount: '₹2,000 Off',
    departures: ['Dec 6', 'Dec 13', 'Dec 20'],
    freebies: true,
    image:
      'https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=900&q=60'
  }
]

export const getTripById = (id) => {
  return trips.find(trip => trip.id === parseInt(id))
}

