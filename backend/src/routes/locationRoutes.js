import { Router } from 'express';
import { SchemeModel } from '../models/db.js';
import { getLocationSchemes, INDIAN_STATES } from '../services/locationService.js';

const router = Router();

// GET /api/location/schemes - Get schemes by coordinates
router.get('/schemes', (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide lat and lon coordinates' 
      });
    }

    const state = getLocationSchemes(parseFloat(lat), parseFloat(lon));
    
    if (!state) {
      return res.json({
        success: true,
        state: null,
        schemes: SchemeModel.findByState('All'),
        message: 'Could not detect state. Showing central government schemes.'
      });
    }

    const schemes = SchemeModel.findByState(state);
    
    res.json({
      success: true,
      state,
      schemes,
      total: schemes.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/location/states - Get all Indian states
router.get('/states', (req, res) => {
  res.json({ success: true, states: INDIAN_STATES });
});

export default router;
