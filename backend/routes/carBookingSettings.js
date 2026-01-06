import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get car booking settings (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT setting_key, setting_value 
      FROM car_booking_settings 
      WHERE setting_key IN ('features', 'form_fields')
    `);

    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    // Default values if not set
    const defaultFeatures = [
      'Experienced Tourist Driver',
      'Good with English Speaking',
      'Police Verified Drivers',
      'Uniformed Drivers',
      'Clean and Non Smelly Cars',
      'Free WiFi'
    ];

    const defaultFormFields = {
      firstName: { label: 'First Name', required: true, visible: true },
      lastName: { label: 'Last Name', required: true, visible: true },
      mobileNumber: { label: 'Mobile Number', required: true, visible: true },
      email: { label: 'Email Address', required: true, visible: true },
      fromDate: { label: 'From Date', required: true, visible: true },
      toDate: { label: 'To Date', required: true, visible: true },
      numberOfAdults: { label: 'Number of Adults', required: true, visible: true },
      numberOfChildren: { label: 'Number of Children', required: false, visible: true },
    };

    res.json({
      features: settings.features || defaultFeatures,
      formFields: settings.form_fields || defaultFormFields,
    });
  } catch (error) {
    console.error('Error fetching car booking settings:', error);
    res.status(500).json({ error: 'Failed to fetch car booking settings' });
  }
});

// Get car booking settings (Admin)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT setting_key, setting_value 
      FROM car_booking_settings 
      WHERE setting_key IN ('features', 'form_fields')
    `);

    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    // Default values if not set
    const defaultFeatures = [
      'Experienced Tourist Driver',
      'Good with English Speaking',
      'Police Verified Drivers',
      'Uniformed Drivers',
      'Clean and Non Smelly Cars',
      'Free WiFi'
    ];

    const defaultFormFields = {
      firstName: { label: 'First Name', required: true, visible: true },
      lastName: { label: 'Last Name', required: true, visible: true },
      mobileNumber: { label: 'Mobile Number', required: true, visible: true },
      email: { label: 'Email Address', required: true, visible: true },
      fromDate: { label: 'From Date', required: true, visible: true },
      toDate: { label: 'To Date', required: true, visible: true },
      numberOfAdults: { label: 'Number of Adults', required: true, visible: true },
      numberOfChildren: { label: 'Number of Children', required: false, visible: true },
    };

    res.json({
      features: settings.features || defaultFeatures,
      formFields: settings.form_fields || defaultFormFields,
    });
  } catch (error) {
    console.error('Error fetching car booking settings:', error);
    res.status(500).json({ error: 'Failed to fetch car booking settings' });
  }
});

// Update car booking settings (Admin only)
router.put('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { features, formFields } = req.body;

    // Update or insert features
    if (features !== undefined) {
      await pool.query(`
        INSERT INTO car_booking_settings (setting_key, setting_value)
        VALUES ('features', $1::jsonb)
        ON CONFLICT (setting_key) 
        DO UPDATE SET setting_value = $1::jsonb, updated_at = CURRENT_TIMESTAMP
      `, [JSON.stringify(features)]);
    }

    // Update or insert form fields
    if (formFields !== undefined) {
      await pool.query(`
        INSERT INTO car_booking_settings (setting_key, setting_value)
        VALUES ('form_fields', $1::jsonb)
        ON CONFLICT (setting_key) 
        DO UPDATE SET setting_value = $1::jsonb, updated_at = CURRENT_TIMESTAMP
      `, [JSON.stringify(formFields)]);
    }

    res.json({
      message: 'Car booking settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating car booking settings:', error);
    res.status(500).json({ 
      error: 'Failed to update car booking settings',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

