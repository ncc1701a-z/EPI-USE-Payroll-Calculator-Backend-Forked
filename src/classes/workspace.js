export class Workspace {
    constructor(map, trail) {
        this.map = map ? new Map(map) : new Map();
        this.trail = trail ? [...trail] : [];
    }

    copy() {
        return new Workspace(this.map, this.trail);
    }

    append_trail(obj, support = {}) {
        let defensive = { ...support };
        defensive['trailIndex'] = this.trail.length;
        this.trail.push([obj, defensive]);
        return this.copy();
    }

    getLastTrailSequence() {
        const len = this.trail.length;
        if (len == 0) throw Error("Unallowed to access empty trail");
        return len - 1;
    }

    has(key) {
        return this.map.has(key);
    }

    set(name, explain, depends, extra, value) {
        if (this.has(name)) throw Error(`Already defined ${name}`);
        const seq = this.getLastTrailSequence();
        this.map.set(name, {
            'narrative': explain,
            'trailIndex': seq,
            'depends': depends,
            'detail': extra,
            'value': value
        });

        return this.copy();
    }

    getValue(name) {
        const result = this.map.get(name);
        if (result) {
            return result.value;
        }
        throw Error(`Name ${name} not found in map`);
    }

    getValueNumeric(name) {
        return Number(this.getValue(name));
    }

    get names() {
        return [...this.map.keys()];
    }

    getDetail(name) {
        return this.map.get(name);
    }
}
