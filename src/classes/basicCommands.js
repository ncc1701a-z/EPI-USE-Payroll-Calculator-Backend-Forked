import * as BaseCommands from './baseCommands.js';
import { Factory } from './factory.js'

export let dataStore = {};
export let explainStore = {};

export function addCommands(factoryInput) {
  const factory = new Factory(factoryInput);
  [
    Perform, 
    Assign,
    Calculate,
    Lookup,
    AccumulativeLookup,
    AssignMany
  ].forEach((command) => { factory.add(command.name, command)});

  return factory;
}

export class Perform extends BaseCommands.PayrollCommand {
  constructor([name]) {
    super();
    this.name = name;
  }

  execute(dataStore, explainStore) {
    return dataStore[this.name].execute(dataStore, explainStore);
  }

  accept(visitor) {
    visitor.visitPerform(this)
    return visitor;
  }
}

export class Assign extends BaseCommands.PayrollCommand {
  constructor([fieldName, input, explanation]) {
    super();
    this.fieldName = fieldName;
    this.input = input;
    this.explanation = explanation;
  }

  accept(visitor) {
    visitor.visitAssign(this);
    return visitor;
  }

  execute(dataStore, explainStore) {
    dataStore[this.fieldName] = this.input;
    explainStore[this.fieldName] = this.explanation + " [" + this.fieldName + " : " + this.input + "]";
    return [ dataStore, explainStore ];
  }
}

export class Calculate extends BaseCommands.PayrollCommand {
  constructor([fieldName, lhs, operatorText, rhs, explanation]) {
    super();
    this.fieldName = fieldName;
    this.lhs = lhs;
    this.operatorText = operatorText;
    this.operation = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => (1.0 * a) / b,
    }[operatorText];
    this.rhs = rhs;
    this.explanation = explanation;
  }

  accept(visitor) {
    visitor.visitCalculate(this);
    return visitor;
  }

  execute(dataStore, explainStore) {
    dataStore[this.fieldName] = this.operation(dataStore[this.lhs], dataStore[this.rhs]);

    explainStore[this.fieldName] = this.explanation + " [" + this.fieldName + " (" + dataStore[this.fieldName] + ") " + " : " + this.lhs + " (" + dataStore[this.lhs] + ") " + this.operatorText + " " + this.rhs + " (" + dataStore[this.rhs] + ")" + "]";

    return [ dataStore, explainStore ];
  }
}

export class Lookup extends BaseCommands.PayrollCommand {
  constructor([fieldName, input, sourceName, operations, explanation]) {
    super();
    this.fieldName = fieldName;
    this.input = input;
    this.sourceName = sourceName;
    this.operations = operations;
    this.explanation = explanation;
  }

  accept(visitor) {
    visitor.visitLookup(this);
    return visitor;
  }

  execute(dataStore, explainStore) {
    for (const option of dataStore[this.sourceName]) {
      const eval1 = evaluateRange(dataStore[this.input], option.Min, '>=');
      const eval2 = evaluateRange(dataStore[this.input], option.Max, '<');

      if (eval1 && eval2) {
        dataStore[this.fieldName] = option;
      }
    }

    explainStore[this.fieldName] = this.explanation + " [" + this.fieldName + " : " + this.input + " (" + dataStore[this.input] + ") " + this.operations + " " + this.sourceName + "]";

    return [ dataStore, explainStore ];
  }
}

export class AccumulativeLookup extends BaseCommands.PayrollCommand {
  constructor([fieldName, input, sourceName, accumulateField, explanation]) {
    super();
    this.fieldName = fieldName;
    this.input = input;
    this.sourceName = sourceName;
    this.accumulateField = accumulateField;
    this.explanation = explanation;
  }

  accept(visitor) {
    visitor.visitAccumulativeLookup(this);
    return visitor;
  }

  execute(dataStore, explainStore) {
    let totalRebate = 0;

    for (const option of dataStore[this.sourceName]) {
      const eval1 = evaluateRange(dataStore[this.input], option.Min, ">=");
      const eval2 = evaluateRange(dataStore[this.input], option.Max, "<");

      if ((eval1 && eval2) || (eval1 && !eval2)) {
        totalRebate += option[this.accumulateField];
      }
    }

    dataStore[this.fieldName] = totalRebate;

    explainStore[this.fieldName] = this.explanation + " [" + this.fieldName + " : " + this.input + " (" + dataStore[this.input] + "), " + this.sourceName + ", " + this.accumulateField + " (" + dataStore[this.fieldName] + ")]";

    return [ dataStore, explainStore ];
  }
}

function evaluateRange(InputA, InputB, Operator) {
  const operators = {
    ">": (a, b) => { return a > b },
    "<": (a, b) => { return a < b },
    ">=": (a, b) => { return a >= b },
    "<=": (a, b) => { return a <= b },
    "=": (a, b) => { return a == b },
  };

  const result = operators[Operator](InputA, InputB);

  return result ? true : false;
}

export class AssignMany extends BaseCommands.PayrollCommand {
  constructor([fieldNames, sourceName, explanation]) {
    super();
    this.fieldNames = fieldNames;
    this.sourceName = sourceName;
    this.explanation = explanation;
  }

  accept(visitor) {
    visitor.visitAssignMany(this);
    return visitor;
  }

  execute(dataStore, explainStore) {
    const values = Object.values(dataStore[this.sourceName]);

    for (let index = 0; index < values.length; index++) {
      dataStore[this.fieldNames[index]] = values[index];
    }

    return [ dataStore, explainStore ];
  }
}
