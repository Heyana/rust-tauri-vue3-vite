import { Obj } from "js-funcs";
import { mapObj } from "js-funcs";

export default class MapEx<T, F> extends Map<T, F> {
  constructor(obj?: { [key: string]: F }) {
    if (!obj) {
      super();
      return;
    }
    const ls = mapObj(obj, (k, v) => {
      return [k, v];
    });
    // @ts-ignore
    super(ls);
  }
  fromObject(obj: Obj) {
    mapObj(obj, (k: any, v) => {
      this.set(k, v);
    });
    // @ts-igno
  }
  toArray(type: "key"): T[];
  toArray(type: "value"): F[];
  toArray(type: "key" | "value") {
    let ls = [];
    for (const map of this.entries()) {
      if (type == "key") {
        ls.push(map[0]);
      } else {
        ls.push(map[1]);
      }
    }
    return ls;
  }
  map(fn: (k: T, v: F, idx: number) => any) {
    return [...this.entries()].map((i, idx) => {
      const [k, v] = i;
      return fn(k, v, idx);
    });
  }
  toJSON() {
    const map: { [key: string]: F } = {};
    this.forEach((val: any, key: any) => {
      map[key] = val;
    });
    return map;
  }
  toString() {
    return JSON.stringify(this.map);
  }
  filterData(fn: (k: T, v: F) => boolean): { key: T; val: F }[] {
    let ls = [];
    for (const [k, v] of this.entries()) {
      const res = fn(k, v);
      if (!res) continue;
      ls.push({ key: k, val: v });
    }
    return ls;
  }
  find(fn: (k: T, v: F) => boolean): undefined | F {
    for (const [k, v] of this.entries()) {
      const res = fn(k, v);
      if (!res) continue;
      return v;
    }
  }
  static formJSON(json: Obj): MapEx<any, any> {
    return new MapEx(json);
  }
  copy(map: MapEx<T, F>) {
    map.map((k, v) => this.set(k, v));
  }
  clone() {
    const map = new MapEx<T, F>();
    this.map((k, v) => map.set(k, v));
    return map;
  }
  index(idx: number, type: "key"): T | undefined;
  index(idx: number, type: "value"): F | undefined;
  index(idx: number, type: "key" | "value" = "key"): any {
    return this.toArray(type as any)[idx];
  }
}
