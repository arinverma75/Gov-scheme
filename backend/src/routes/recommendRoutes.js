import { Router } from 'express';
import { getRecommendations, getQuickEligibility } from '../services/recommendService.js';

const router = Router();

// POST /api/recommend - Get AI-powered scheme recommendations
router.post('/', (req, res) => {
  try {
    const profile = req.body;
    
    if (!profile || Object.keys(profile).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide profile information (age, income, state, etc.)' 
      });
    }

    const recommendations = getRecommendations(profile);
    
    res.json({
      success: true,
      total: recommendations.length,
      profile,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/recommend/quick - Quick eligibility check
router.post('/quick', (req, res) => {
  try {
    const profile = req.body;
    const result = getQuickEligibility(profile);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
