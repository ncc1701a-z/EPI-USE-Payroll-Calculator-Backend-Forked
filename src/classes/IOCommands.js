import * as BaseCommands from './baseCommands.js';
import { Factory } from './factory.js';

export function addCommands(factoryInput) {
    const factory = new Factory(factoryInput);
    [
        DefineExternalInput,
        DefineExternalOutput,
    ].forEach((command) => { factory.add(command.name, command) });

    return factory;
}

export class DefineExternalInput extends BaseCommands.PayrollCommand {
    constructor([type, fieldName, value, validate]) {
        super();
        this.fieldName = fieldName;
        this.type = type;
        this.value = value;
        this.validate = validate;
    }

    accept(visitor) {
        visitor.visitDefineExternalInput(this);
        return visitor;
    }

    execute(dataStore, explainStore) {
        return [dataStore, explainStore];
    }
}

export class DefineExternalOutput extends BaseCommands.PayrollCommand {
    constructor([fieldName, explanation]) {
        super();
        this.fieldName = fieldName;
        this.explanation = explanation;
    }

    accept(visitor) {
        visitor.visitDefineExternalOutput(this);
        return visitor;
    }

    execute(dataStore, explainStore) {
        return [dataStore, explainStore];
    }
}