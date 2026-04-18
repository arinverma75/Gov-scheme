import { Router } from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer for memory storage (serverless compatible)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, BMP) and PDF are allowed'));
    }
  }
});

// POST /api/ocr/scan - Upload document for OCR
// Note: Actual OCR is done client-side with Tesseract.js for privacy
// This endpoint handles file upload and returns base64 data
router.post('/scan', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please upload a document file' 
      });
    }

    // Return base64 data URL for client-side OCR
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    // Store in Vercel Blob (optional - only if token exists)
    let blobUrl = null;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const filename = `ocr/${uuidv4()}-${req.file.originalname}`;
        const blob = await put(filename, req.file.buffer, {
          access: 'public',
          contentType: req.file.mimetype
        });
        blobUrl = blob.url;
      } catch (blobErr) {
        console.warn('Blob storage failed:', blobErr.message);
        // Continue without blob storage - not critical
      }
    }

    res.json({
      success: true,
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        dataUrl,
        ...(blobUrl && { blobUrl })
      },
      message: 'Document uploaded successfully. OCR processing happens client-side for privacy.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ocr/autofill - Auto-fill form from OCR data  
router.post('/autofill', (req, res) => {
  try {
    const { ocrText } = req.body;

    if (!ocrText) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide OCR text' 
      });
    }

    // Extract common fields using regex patterns
    const extracted = {};

    // Aadhaar number (12 digits, possibly with spaces)
    const aadhaarMatch = ocrText.match(/\b(\d{4}\s?\d{4}\s?\d{4})\b/);
    if (aadhaarMatch) {
      extracted.aadhaarNumber = aadhaarMatch[1].replace(/\s/g, '');
    }

    // Name (look for patterns like "Name:" or after common prefixes)
    const nameMatch = ocrText.match(/(?:Name|नाम)\s*[:\s]\s*([A-Za-z\s]+)/i);
    if (nameMatch) {
      extracted.name = nameMatch[1].trim();
    }

    // Date of birth
    const dobMatch = ocrText.match(/(?:DOB|Date of Birth|जन्म तिथि)\s*[:\s]\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
    if (dobMatch) {
      extracted.dateOfBirth = dobMatch[1];
    }

    // Gender
    const genderMatch = ocrText.match(/(?:Gender|लिंग)\s*[:\s]\s*(Male|Female|पुरुष|महिला)/i);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      extracted.gender = (g === 'male' || g === 'पुरुष') ? 'Male' : 'Female';
    }

    // Address
    const addressMatch = ocrText.match(/(?:Address|पता)\s*[:\s]\s*(.+?)(?=\n|$)/i);
    if (addressMatch) {
      extracted.address = addressMatch[1].trim();
    }

    // PAN number
    const panMatch = ocrText.match(/\b[A-Z]{5}\d{4}[A-Z]\b/);
    if (panMatch) {
      extracted.panNumber = panMatch[0];
    }

    // Pincode
    const pinMatch = ocrText.match(/\b(\d{6})\b/);
    if (pinMatch) {
      extracted.pincode = pinMatch[1];
    }

    res.json({
      success: true,
      extracted,
      fieldsFound: Object.keys(extracted).length,
      rawTextLength: ocrText.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
