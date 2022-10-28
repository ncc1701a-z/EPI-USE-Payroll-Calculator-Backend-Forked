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
    constructor([input, fieldName, type, destination, validate]) {
        super();
        this.input = input;
        this.fieldName = fieldName;
        this.type = type;
        this.destination = destination;
        this.validate = validate;
    }

    accept(visitor) {
        visitor.visitDefineExternalInput(this);
        return visitor;
    }

    execute(dataStore, explainStore) {      
        return [ dataStore, explainStore ];
    }
}

export class DefineExternalOutput extends BaseCommands.PayrollCommand {
    constructor([fieldName, destination]) {
        super();
        this.fieldName = fieldName;
        this.destination = destination;
    }

    accept(visitor) {
        visitor.visitDefineExternalOutput(this);
        return visitor;
    }

    execute(dataStore, explainStore) {
        return [ dataStore, explainStore ];
    }
}