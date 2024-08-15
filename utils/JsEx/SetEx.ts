export default class SetEx<T = string> extends Set<T> {
  constructor(ls?: any[]) {
    super();
    ls?.map((i) => this.add(i));
  }
  add(value: T | T[]): this {
    if (Array.isArray(value)) {
      value.map((i) => this.add(i));
    } else {
      super.add(value);
    }
    return this;
  }
  remove(value: T | T[]): this {
    if (Array.isArray(value)) {
      value.map((i) => this.remove(i));
    } else {
      if (!super.has(value)) return;
      super.delete(value);
    }
    return this;
  }
  isSet = true;
  toArray() {
    return [...this];
  }
  map(fn: (val: T, idx?: number) => any, filter = false) {
    const ls: any[] = [];
    let index = 0;
    this.forEach((val) => {
      const b = fn(val, ++index);
      if (!filter) return ls.push(b);
      b && ls.push(b);
    });
    return ls;
  }
  find(fn: (val: T) => boolean) {
    for (const val of this) {
      if (fn(val)) return val;
    }
    return undefined;
  }
  findThenDel(fn: (val: T) => boolean) {
    for (const val of this) {
      if (fn(val)) {
        this.delete(val);
        return true;
      }
    }
    return undefined;
  }
  filter(fn: (val: T) => boolean) {
    const ls: T[] = [];
    for (const val of this) {
      if (!fn(val)) continue;
      ls.push(val);
    }
    return ls;
  }
  toJSON() {
    return this.toArray();
  }
  index(idx: number) {
    return [...this][idx];
  }
  toggle(str: T) {
    if (this.has(str)) {
      this.delete(str);
    } else {
      this.add(str);
    }
  }
  copy(ls: SetEx<T>) {
    this.add(ls.toArray());
    return this;
  }
  static filter(ls: any[]) {
    return new SetEx(ls).toArray();
  }
}
