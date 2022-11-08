import * as factory from "../classes/factory.js";
import * as visitors from '../classes/visitors.js';
import fs from 'fs';
import { Workspace } from "../classes/workspace.js";

const getPayrollFunctions = async (region) => {
    region = region.toUpperCase();

    const path = `public/assets/json/${region}/2023/functions.json`

    if(!fs.existsSync(path)) {
        throw Error('Missing payroll functions file');
    }

    const response = await fs.promises.readFile(path, 'utf-8');    
    return JSON.parse(response);
}

export const loadPlan = async (region, calculationType) => {
    region = region.toUpperCase();

    const path = `public/assets/json/${region}/2023/payroll.json`;

    if(!fs.existsSync(path)) {
        throw Error('Missing payroll file for region');
    }

    const planJson = JSON.parse(await fs.promises.readFile(path, 'utf-8'));

    return factory.loadPlan(planJson, calculationType);
}

export const calculate = async (data) => {
    let workspace = new Workspace();

    const payrollFunctions = await getPayrollFunctions(data.region);

    const plan = await loadPlan(data.region.toUpperCase(), data.calculation_type);

    // plan.accept(new visitors.DefineExternalInputVisitor(data, workspace));

    workspace = plan.execute(workspace);

    console.log(workspace)

    // const calcResult = plan.accept(new visitors.DefineExternalOutputVisitor(workspace)).output;

    return { calcResult, workspace };
}