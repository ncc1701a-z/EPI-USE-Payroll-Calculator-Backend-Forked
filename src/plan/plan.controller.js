import * as planService from '../plan/plan.service.js';

export const getPlan = (_req, res) => {
    res.json(planService.retrievePlan());
};

export const calculate = async (req, res) => {
    res.json(await planService.calculate(req.body));
};