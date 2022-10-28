import * as BaseCommands from './baseCommands.js';
import { Factory } from './factory.js';

export function addCommands(factoryInput) {
    const factory = new Factory(factoryInput);
    [
        Plan,
        SavePlan,
        Evaluate
    ].forEach((command) => { factory.add(command.name, command) });

    return factory;
}

export class Plan extends BaseCommands.PayrollCommand {
    constructor([commands]) {
        super();
        this.commands = commands;
    }

    accept(visitor) {
        this.commands.forEach((command) => {
            command.accept(visitor);
        });

        return visitor;
    }

    execute(dataStore, explainStore) {
        this.commands.forEach((command) => {
            command.execute(dataStore, explainStore);
        });

        return [ dataStore, explainStore ];
    }
}

export class SavePlan extends BaseCommands.PayrollCommand {
    constructor([plan, name]) {
        super();
        this.plan = plan;
        this.name = name;
    }

    accept(visitor) {
        return this.plan.accept(visitor);
    }

    execute(dataStore, explainStore) {
        dataStore[this.name] = this.plan;

        return [ dataStore, explainStore ]
    }
}

export class Evaluate extends BaseCommands.PayrollCommand {
    constructor([fieldName, value1, operation, value2, ifTrue, ifFalse, explanation]) {
        super();
        this.fieldName = fieldName;
        this.value1 = value1;
        this.operation = operation;
        this.value2 = value2;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
        this.explanation = explanation;
    }

    accept(visitor) {
        visitor.visitEvaluate(this);
        return visitor;
    }

    execute(dataStore, explainStore) {
        switch (this.operation) {
            case ">":
                this.result = dataStore[this.value1] > dataStore[this.value2];
                break;
            case "<":
                this.result = dataStore[this.value1] < dataStore[this.value2];
                break;
            case "=":
                this.result = dataStore[this.value1] == dataStore[this.value2];
                break;
            case ">=":
                this.result = dataStore[this.value1] >= dataStore[this.value2];
                break;
            case "<=":
                this.result = dataStore[this.value1] <= dataStore[this.value2];
                break;
            default:
                throw Error(`Invalid operation ${this.operation}`);
        }

        explainStore[this.fieldName] = this.explanation + " [" + this.fieldName + " : " + this.value1 + " (" + dataStore[this.value] + ") " + this.operation + " " + this.value2 + " (" + dataStore[this.value2] + ")]";

        if (this.result) {
            this.ifTrue.execute(dataStore, explainStore);
        } else {
            this.ifFalse.execute(dataStore, explainStore);
        }

        return [ dataStore, explainStore ];
    }
}
