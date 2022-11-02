export class PayrollCommand {
    constructor(explain, assignsTo = null, depends = []) {
        this.explain = explain;
        this.assigns_to = assignsTo;
        this.depends = [...depends];
    }

    asyncInit() {
        return new Promise((resolve) => {
            resolve(this);
        });
    }

    execute(workspace) {
        return workspace;
    }

    addItem(workspace, value, extra = {}) {
        const name = this.assignsTo;
        const explain = this.explain;
        const depends = this.depends;

        return workspace.set(name, explain, depends, extra, value);
    }

    accept(_visitor) { }

    asJson() {
        return {
            assignsTo: this.assignsTo,
            explain: this.explain,
            depends: this.depends,
            commandName: this.constructor.name
        };
    }
}