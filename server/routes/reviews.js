const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, reviewsController.createReview);
router.get('/:handypersonId', reviewsController.getHandypersonReviews);

module.exports = router;