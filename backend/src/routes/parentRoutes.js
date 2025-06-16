import express from 'express';
import { authorize } from '../middleware/authMiddleware.js';
import { getParentProfile } from '../controllers/parentController/getParentProfile.js';
import { updateParentProfile } from '../controllers/parentController/updateParentProfile.js';

const router = express.Router();

// A POST request to /api/children/add will first run the authorize middleware.
// If the user is a 'parent', it will then proceed to the addChild controller.
router.get('/me', authorize('parent'), getParentProfile);
router.put('/me', authorize('parent'), updateParentProfile);

// Add other routes here as you build them out...

export default router;