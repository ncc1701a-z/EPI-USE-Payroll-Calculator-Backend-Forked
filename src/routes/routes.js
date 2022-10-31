import express from 'express';
import { index } from '../routes/app.route.js';
import { plan } from '../routes/plan.route.js';

const routes = express.Router();

routes.use(index);
routes.use(plan);

export default routes;




