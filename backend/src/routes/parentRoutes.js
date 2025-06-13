import express from 'express';
import { addChild } from '../controllers/childrenController/addChild.js';
import { getMyChildren } from '../controllers/childrenController/getChildren.js';
import { authorize } from '../middleware/authMiddleware.js';
import { getParentProfile } from '../controllers/parentController/getParentProfile.js';

const router = express.Router();

// A POST request to /api/children/add will first run the authorize middleware.
// If the user is a 'parent', it will then proceed to the addChild controller.
router.get('/me', authorize('parent'), getParentProfile);
router.post('/add', authorize('parent'), addChild);
router.post('/my-children', authorize('parent'), getMyChildren);

// Add other routes here as you build them out...

export default router;