import { Router } from 'express';
import { SchemeModel } from '../models/db.js';

const router = Router();

// GET /api/schemes - List all schemes (paginated, filterable)
router.get('/', (req, res) => {
  try {
    const { page, limit, category, state, status, search } = req.query;
    const result = SchemeModel.findAll({ page, limit, category, state, status, search });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/schemes/categories - Get all categories with counts
router.get('/categories', (req, res) => {
  try {
    const categories = SchemeModel.getCategories();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/schemes/states - Get all states
router.get('/states', (req, res) => {
  try {
    const states = SchemeModel.getStates();
    res.json({ success: true, states });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/schemes/search?q= - Search schemes
router.get('/search', (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const result = SchemeModel.findAll({ search: q, page, limit });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/schemes/state/:state - Get state-specific schemes
router.get('/state/:state', (req, res) => {
  try {
    const schemes = SchemeModel.findByState(req.params.state);
    res.json({ success: true, schemes, total: schemes.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/schemes/category/:cat - Get schemes by category
router.get('/category/:cat', (req, res) => {
  try {
    const schemes = SchemeModel.findByCategory(req.params.cat);
    res.json({ success: true, schemes, total: schemes.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/schemes/:id - Get scheme details
router.get('/:id', (req, res) => {
  try {
    const scheme = SchemeModel.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found' });
    }
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
