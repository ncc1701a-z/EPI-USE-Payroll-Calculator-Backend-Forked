const planService = require('../plan/plan.service');

const getPlan = ((req, res) => {
    res.json(planService.retrievePlan());
});

module.exports = {
    getPlan
}