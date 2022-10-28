import * as planService from '../plan/plan.service.js';

export const getPlan = ((_req, response) => {
    response.json(planService.retrievePlan());
});
