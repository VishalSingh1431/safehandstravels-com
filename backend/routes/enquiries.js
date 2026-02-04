import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import Enquiry from '../models/Enquiry.js';
import { sendTripEnquiryEmail } from '../utils/emailService.js';

const router = express.Router();

// Create enquiry (Public - no auth required)
router.post('/', async (req, res) => {
  try {
    const { tripId, tripTitle, tripLocation, tripPrice, selectedMonth, numberOfTravelers, name, email, phone, message, enquiryType, numPeople, destination, monthOfTravel } = req.body;

    const isForm2 = enquiryType === 'form2';

    // Validation: email always required
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!isForm2 && !name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    // Phone: required and must have at least 10 digits
    const phoneDigits = (phone && typeof phone === 'string' ? phone.replace(/\D/g, '') : '') || (phone && String(phone).replace(/\D/g, ''));
    if (!phone || phoneDigits.length < 10 || phoneDigits.length > 15) {
      return res.status(400).json({ error: 'Valid phone number with country code is required (10–15 digits)' });
    }

    // Create enquiry (model handles form2 name placeholder and destination/enquiry_type)
    const enquiry = await Enquiry.create({
      tripId,
      tripTitle,
      tripLocation,
      tripPrice,
      selectedMonth: selectedMonth || monthOfTravel,
      numberOfTravelers: numberOfTravelers ?? numPeople ?? 1,
      name: isForm2 ? undefined : name,
      email,
      phone,
      message: isForm2 ? null : message,
      enquiryType: isForm2 ? 'form2' : 'form1',
      destination: isForm2 ? destination : null,
      monthOfTravel: isForm2 ? monthOfTravel : null,
    });

    let emailSent = false;
    try {
      await sendTripEnquiryEmail({
        tripTitle,
        tripLocation,
        tripPrice,
        selectedMonth: selectedMonth || monthOfTravel,
        numberOfTravelers: numberOfTravelers ?? numPeople ?? 1,
        name: name || (isForm2 ? 'Trip Enquiry' : ''),
        email,
        phone,
        message: isForm2 ? `Destination: ${destination || '—'}. Month: ${monthOfTravel || '—'}.` : message,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send enquiry email:', emailError);
    }

    res.status(201).json({
      message: 'Enquiry submitted successfully',
      emailSent,
      ...(emailSent ? {} : { warning: 'Enquiry saved but notification email could not be sent. Please check the enquiry in admin.' }),
      enquiry: {
        id: enquiry.id,
        tripTitle: enquiry.tripTitle,
        selectedMonth: enquiry.selectedMonth,
        numberOfTravelers: enquiry.numberOfTravelers,
      },
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ 
      error: 'Failed to submit enquiry',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all enquiries (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, tripId, limit, offset } = req.query;
    
    const enquiries = await Enquiry.findAll({
      status,
      tripId: tripId ? parseInt(tripId) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    res.json({
      enquiries,
      count: enquiries.length,
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Get enquiry by ID (Admin only)
router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json({ enquiry });
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
});

// Update enquiry status (Admin only)
router.patch('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'contacted', 'booked', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const enquiry = await Enquiry.updateStatus(id, status);

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json({
      message: 'Enquiry status updated successfully',
      enquiry,
    });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

export default router;
