import * as BaseCommands from './baseCommands.js';
import { Factory } from './factory.js';
import { readFile } from 'fs/promises'

export function addCommands(factoryInput) {
    const factory = new Factory(factoryInput);
    [
        LoadTable,
    ].forEach((command) => { factory.add(command.name, command) });

    return factory;
}

export class LoadTable extends BaseCommands.PayrollCommand {
    constructor([fieldName, tableSource, explanation]) {
        super();
        this.fieldName = fieldName
        this.tableSource = tableSource;
        this.explanation = explanation;
    }

    async_init() {
        if (this.tableSource) {
            return new Promise((resolve) => {
                (async () => {
                    this.tableData = JSON.parse(await readFile(this.tableSource, 'utf-8'));
                    resolve(this);
                })();
            });
        }
    }


    accept(visitor) {
        visitor.visitLoadTable(this);
        return visitor;
    }

    execute(dataStore, explainStore) {
        dataStore[this.fieldName] = this.tableData;
        explainStore[this.fieldName] = this.explanation;

        return [ dataStore, explainStore ];
    }
}