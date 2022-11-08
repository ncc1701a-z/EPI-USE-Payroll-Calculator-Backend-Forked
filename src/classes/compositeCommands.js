import * as BaseCommands from './baseCommands.js';
import { Factory } from './factory.js';

export function addCommands(factoryInput) {
    const factory = new Factory(factoryInput);
    [
        Plan,
        SavePlan,
        Evaluate,
    ].forEach((command) => { factory.add(command.name, command) });

    return factory;
}

export class Plan extends BaseCommands.PayrollCommand {
    constructor(steps, explain) {
        super(explain);
        this.steps = steps ? steps : [];
    }

    accept(visitor) {
        this.steps.forEach((visitor) => {
            visitor.accept(visitor);
        });

        return visitor;
    }

    execute(workspace) {
        let ws = workspace.appendTrail(this, { action: "Entry" });
        const started = ws.getLastTrailSequence();

        this.steps.forEach((step) => {
            ws = step.execute(workspace);
        });

        return ws.appendTrail(this, { action: "Exit", startedTrailIndex: started });
    }

    asJson() {
        let result = super.asJson();
        result['countSteps'] = this.steps.length;
        return result;
    }
}

export class SavePlan extends BaseCommands.PayrollCommand {
    constructor(plan) {
        super();
        this.plan = plan;
    }

    accept(visitor) {
        // this.plan.forEach((p) => {
        //     visitor.accept(p);
        // });

        // return visitor;
    }

    execute(workspace) {

    }
}

export class Evaluate extends BaseCommands.PayrollCommand {
    constructor(explain, lhs, operation, rhs, trueBranch = null, falseBranch = null) {
        super(explain, null, [lhs, rhs]);
        this.lhs = lhs;
        this.operation = operation;
        this.rhs = rhs;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;

        if (!(this.trueBranch || this.falseBranch)) {
            throw Error(`If ${explain} requires at least one of true or false branch and has neither set`);
        }
    }

    accept(visitor) {
        visitor.visitEvaluate(this);
        return visitor;
    }

    execute(workspace) {
        let ws = workspace.append_trail(this, { action: "Entry" });

        const lhs = ws.getValueNumeric(this.lhs);
        const rhs = ws.getValueNumeric(this.rhs);

        let result = null;

        switch (this.operation) {
            case ">": result = lhs > rhs; break;
            case "<": result = lhs < rhs; break;
            case "=": result = lhs == rhs; break;
            case ">=": result = lhs >= rhs; break;
            case "<=": result = lhs <= rhs; break;
            default: throw Error(`Invalid operation ${this.operation}`);
        }

        ws = workspace.appendTrail(this, { action: "Start branch", compareResult: result });
        const started = ws.getLastTrailSequence();

        if (result) {
            ws = this.trueBranch.execute(ws);
        } else {
            ws = this.falsebranch.execute(ws);
        }

        return ws.appendTrail(this, { action: "Branch and If completed", startedTrailIndex: started });
    }

    asJson() {
        let result = super.asJson();
        result['operation'] = this.op;
        result['hasTrue'] = this.trueBranch != null;
        result['hasFalse'] = this.falseBranch != null;
        return result;
    }
}
