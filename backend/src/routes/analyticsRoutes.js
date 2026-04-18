import { Router } from 'express';
import { AnalyticsModel } from '../models/db.js';

const router = Router();

// GET /api/analytics/dashboard
router.get('/dashboard', (req, res) => {
  try {
    const summary = AnalyticsModel.getSummary();
    const byCategory = AnalyticsModel.getSchemesByCategory();
    const byState = AnalyticsModel.getSchemesByState();
    const byStatus = AnalyticsModel.getSchemesByStatus();
    const awarenessGap = AnalyticsModel.getAwarenessGap();

    res.json({
      success: true,
      dashboard: {
        summary,
        byCategory,
        byState,
        byStatus,
        awarenessGap
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
