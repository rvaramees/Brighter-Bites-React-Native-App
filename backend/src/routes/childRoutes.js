import express from 'express';
import { addChild } from '../controllers/childController/add_child.js';
import { getMyChildren } from '../controllers/childController/get_children.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// A POST request to /api/children/add will first run the authorize middleware.
// If the user is a 'parent', it will then proceed to the addChild controller.
router.post('/add', authorize('parent'), addChild);
router.post('/my-children', authorize('parent'), getMyChildren);

// Add other routes here as you build them out...

export default router;