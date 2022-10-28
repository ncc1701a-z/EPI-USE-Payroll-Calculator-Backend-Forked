const express = require('express');
const router = express.Router();

const planController = require('../plan/plan.controller');

router.get('/plan', planController.getPlan);


module.exports = router;