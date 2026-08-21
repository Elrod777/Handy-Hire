const express = require('express');
const router = express.Router();
const handypeopleController = require('../controllers/handypeopleController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', handypeopleController.getAllHandypeople);
router.get('/:id', handypeopleController.getHandypersonById);
router.put('/:id', authenticate, authorize(['handyperson']), handypeopleController.updateProfile);

module.exports = router;