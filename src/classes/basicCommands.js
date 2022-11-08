import * as BaseCommands from './baseCommands.js';
import { Factory } from './factory.js';

export let dataStore = {};
export let explainStore = {};

export function addCommands(factoryInput) {
  const factory = new Factory(factoryInput);
  [
    Perform,
    Assign,
    Calculate,
    Copy,
    Cap
  ].forEach((command) => { factory.add(command.name, command) });

  return factory;
}

export class Perform extends BaseCommands.PayrollCommand {
  constructor(name) {
    super();
    this.name = name;
  }

  execute(workspace) {    
    return workspace.getValue(this.name).execute(dataStore, explainStore);
  }

  accept(visitor) {
    visitor.visitPerform(this)
    return visitor;
  }
}

export class Copy extends BaseCommands.PayrollCommand {
  constructor(assignsTo, copyFrom, explain, ...extraDependencies) {
    super(explain, assignsTo, [copyFrom, ...extraDependencies]);
    this.copyFrom = copyFrom;
  }

  execute(workspace) {
    const ws = workspace.appendTrail(this);
    return this.addItem(ws, ws.getValue(this.copyFrom));
  }
}


export class Cap extends BaseCommands.PayrollCommand {
  constructor(assignsTo, source, noHigherThan, explain) {
    super(explain, assignsTo, [source, noHigherThan]);
    this.source = source;
    this.noHigherThan = noHigherThan;
  }

  execute(workspace) {
    const ws = workspace.appendTrail(this);
    const value = ws.getValueNumeric(this.source);
    const cap = ws.getValueNumeric(this.noHigherThan);

    return this.addItem(ws, value > cap ? cap : value);
  }
}

export class Assign extends BaseCommands.PayrollCommand {
  constructor(assignsTo, value, explain) {
    super(explain, assignsTo);
    this.value = value;
  }

  execute(workspace) {
    const ws = workspace.appendTrail(this);
    return this.addItem(ws, this.value);
  }

  asJson() {
    const result = super.asJson();
    result['constantValue'] = this.value;
    return result;
  }
}

export class Calculate extends BaseCommands.PayrollCommand {
  constructor(assignsTo, reads1, operatorText, reads2, explain) {
    super(explain, assignsTo, [reads1, reads2]);
    this.reads1 = reads1;
    this.operation = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => (1.0 * a) / b,
    }[operatorText];
    this.reads2 = reads2;
  }

  accept(visitor) {
    visitor.visitCalculate(this);
    return visitor;
  }

  execute(workspace) {
    const ws = workspace.append_trail(this);

    const value = this.operation(ws.getValueNumeric(this.reads1), ws.getValueNumeric(this.reads2));
    return this.addItem(ws, value, { 'calculation': `${this.reads1} ${this.operation} ${this.reads2}` });
  }

  asJson() {
    const result = super.asJson();
    result['operation'] = this.operation;
    return result;
  }
}


