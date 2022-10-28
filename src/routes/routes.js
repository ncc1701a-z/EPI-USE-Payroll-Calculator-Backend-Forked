const express = require('express');
const router = express.Router();

const indexRoute = require('../routes/index');
const planRoute = require('../plan/plan.route');

router.use(indexRoute);
router.use(planRoute);

module.exports = router;
