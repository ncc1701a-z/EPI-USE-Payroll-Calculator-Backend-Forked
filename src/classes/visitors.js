class BaseVisitor {
  constructor() { }

  visitPerform() { }

  visitLoadTable() { }

  visitDefineExternalInput() { }

  visitAssign() { }

  visitCalculate() { }

  visitLookup() { }

  visitAccumulativeLookup() { }

  visitDefineExternalOutput() { }

  visitEvaluate() { }

  visitAssignMany() {
  }
}

export class DefineExternalInputVisitor extends BaseVisitor {
  constructor(data, dataStore) {
    super();
    this.data = data;
    this.dataStore = dataStore;
  }

  visitDefineExternalInput(o) {

  }
}

export class DefineExternalOutputVisitor extends BaseVisitor {
  constructor(dataStore) {
    super();
    this.dataStore = dataStore;
    this.output = {};
  }

  visitDefineExternalOutput(o) { 
    this.output[o.fieldName] = this.dataStore[o.fieldName];
  }
}

export class InputValidationVisitor extends BaseVisitor {
  constructor() {
    super();
    this.formErrors = [];
    this.error = false;
  }

  visitDefineExternalInput(o) {
    (o)
  }
}

