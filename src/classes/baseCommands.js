export class PayrollCommand {
    execute(_dataStore, _explainStore) { }

    accept(_visitor) { }

    async_init() {
        return new Promise((resolve) => {
            resolve(this);
        });
    }
}