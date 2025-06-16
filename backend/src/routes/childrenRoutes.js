import express from 'express';
import { addChild } from '../controllers/childrenController/addChild.js';
import { getMyChildren } from '../controllers/childrenController/getChildren.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
// A POST request to /api/children/add will first run the authorize middleware.

router.post('/add', authorize('parent'), addChild);
router.post('/my-children', authorize('parent'), getMyChildren);

export default router;