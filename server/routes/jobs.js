const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, jobSchema } = require('../middleware/validation');

router.get('/', jobsController.getAllJobs);
router.get('/:id', jobsController.getJobById);
router.post('/', authenticate, authorize(['customer']), validate(jobSchema), jobsController.createJob);
router.put('/:id', authenticate, authorize(['customer']), jobsController.updateJob);
router.delete('/:id', authenticate, authorize(['customer']), jobsController.deleteJob);

module.exports = router;