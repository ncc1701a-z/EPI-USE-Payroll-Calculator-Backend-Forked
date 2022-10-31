import * as factory from "../classes/factory.js";
import * as visitors from '../classes/visitors.js';
import { readFile } from 'fs/promises'

export const retrievePlan = () => {
    return 'Hello World';
}

export async function loadPlan(calculationType) {
    const planJson = JSON.parse(await readFile('public/assets/json/plan.json', 'utf-8'));
    return factory.loadPlan(planJson, calculationType);
}

export async function calculate(data) {
    let dataStore = {};
    let explainStore = {};

    const plan = await loadPlan(data.CalculationType);

    plan.accept(new visitors.DefineExternalInputVisitor(data, dataStore));

    [dataStore, explainStore] = plan.execute(dataStore, {});

    const calcResult = plan.accept(new visitors.DefineExternalOutputVisitor(dataStore)).output;

    return { calcResult, explainStore };
}