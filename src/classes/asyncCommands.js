import * as BaseCommands from './baseCommands.js';
import * as Tables from './tables.js';
import { Factory } from './factory.js';
import { readFile } from 'fs/promises'

export function addCommands(factoryInput) {
    const factory = new Factory(factoryInput);
    [
        LoadTable,
        Lookup,
        LoadConfiguration
    ].forEach((command) => { factory.add(command.name, command) });

    return factory;
}

class AsyncLoadBase extends BaseCommands.PayrollCommand {
    constructor(assignsTo, data) {
        super("Pending load ...", assignsTo);
        if (typeof data == 'string') {
            this.initUrl = data;
            this.data = null;
        } else {
            this.initUrl = null;
            this.data = data;
        }
    }

    postInit() {
        throw Error("Implement this");
    }

    execute(workspace) {
        const ws = workspace.appendTrail(this);
        return this.addItem(ws, this.data, { initUrl: this.initUrl });
    }

    asyncInit() {
        const assign = this;
        const url = this.initUrl;

        if (url) {
            return new Promise(async (resolve) => {
                assign.data = await JSON.parse(await readFile(url));
                resolve(this.postInit.call(assign));
            });
        }
    }
}

export class LoadConfiguration extends AsyncLoadBase {
    constructor([data]) {
        super(data);
    }

    postInit() {
        if (this.data.style === 'config') {
            if (this.data.values) {
                return true;
            }
        }

        throw Error(`Config loaded in ${this.initUrl} is malformed`);
    }
}

export class LoadTable extends AsyncLoadBase {
    constructor(assignsTo, tableData) {
        super(assignsTo, tableData);
    }

    postInit() {
        if (Tables.isValidStyle(this.data)) {
            if (this.data.table) {
                this.data = Tables.cacheBrackets(this.data);
            }

            return true;
        }

        throw Error(`Table loaded in ${this.initUrl} is malformed`);
    }

    execute(dataStore, explainStore) {
        dataStore[this.assignsTo] = this.data;
        explainStore[this.assignsTo] = this.explanation;

        return [dataStore, explainStore];
    }
}

export class Lookup extends BaseCommands.PayrollCommand {
    constructor(assignsTo, keyName, tableName, explain) {
        super(explain, assignsTo, [keyName, tableName]);
        this.keyName = keyName;
        this.tableName = tableName;
    }

    accept(visitor) {
        visitor.visitLookup(this);
        return visitor;
    }

    execute(workspace) {
        const ws = workspace.appendTrail(this);
        const table = ws.getValue(this.tableName);
        const lookupResult = Tables.lookupCached(ws.getValueNumeric(this.keyName), table);

        return this.addItem(ws, lookupResult.result, lookupResult);
    }
}