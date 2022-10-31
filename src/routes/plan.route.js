import express  from 'express';
import * as planController from '../controllers/plan.controller.js';

const plan = express.Router();

plan.get('/payroll', planController.getPlan);

plan.post('/payroll/calculate', planController.calculate);

export { plan };