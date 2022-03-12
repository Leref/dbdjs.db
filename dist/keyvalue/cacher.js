"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacher = void 0;
class Cacher {
    constructor(options, init) {
        this.data = new Map(init);
        this.options = options;
    }
    set(key, value) {
        if (this.options?.sorted) {
            this.data.set(key, value);
            this.sort();
            return this;
        }
        else if (this.data.size < (this.options?.limit ?? 10000)) {
            this.data.set(key, value);
            return this;
        }
    }
    get(key) {
        return this.data.get(key);
    }
    delete(key) {
        return this.data.delete(key);
    }
    clear() {
        return this.data.clear();
    }
    find(func) {
        for (const [key, value] of this.data) {
            if (func(value, key, this))
                return value;
        }
    }
    filter(func) {
        const res = [];
        for (const [key, value] of this.data) {
            if (func(value, key, this)) {
                res.push(value);
            }
        }
        return res;
    }
    some(func) {
        for (const [key, value] of this.data) {
            if (func(value, key, this))
                return true;
        }
        return false;
    }
    every(func) {
        for (const [key, value] of this.data) {
            if (!func(value, key, this))
                return false;
        }
        return true;
    }
    forEach(func) {
        for (const [key, value] of this.data) {
            func(value, key, this);
        }
    }
    map(func) {
        const res = [];
        for (const [key, value] of this.data) {
            res.push(func(value, key, this));
        }
        return res;
    }
    sort() {
        let entries = [...this.data.entries()];
        this.data.clear();
        entries = entries.sort((a, b) => {
            if ((a[1].value ?? 0) < (b[1].value ?? 0))
                return 1;
            else if ((a[1].value ?? 0) === (b[1].value ?? 0))
                return 0;
            else
                return -1;
        });
        let i = 0;
        while (i < (this.options?.limit ?? 10000)) {
            this.data.set(entries[i][0], entries[i][1]);
            i++;
        }
    }
}
exports.Cacher = Cacher;