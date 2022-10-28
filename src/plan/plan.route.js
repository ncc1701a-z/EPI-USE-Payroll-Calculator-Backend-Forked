import express  from 'express';
import * as planController from '../plan/plan.controller.js';

const plan = express.Router();

plan.get('/plan', planController.getPlan);

export { plan };