import _ from 'lodash';

export const isDef = (d1: any, d2: any) => {
  if (!is(d1)) return true;
  const keys = Object.keys(d1);

  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    const item1 = d1[key];
    const item2 = d2[key];

    if (is(item1) && is(item2)) {
      const res = isDef(item1, item2);
      //已经不相等
      if (res) return true;
    } else {
      //相等继续
      if (item1 === item2) {
        continue;
      } else {
        //如果是数字
        if (_.isNumber(item1) && _.isNumber(item2)) {
          const abs = Math.abs(item1 - item2);
          //如果差值大于0.000001 不相等
          if (abs > 0.000001) {
            return true;
          } else {
            //相等继续
            continue;
          }
          //其他类型
        } else {
          //如果相等
          if (item1 === item2) {
            //继续
            continue;
          } else {
            //不相等
            return true;
          }
        }
      }
    }
  }
  return false;
};
export const is = (d: any) => {
  return d?.constructor === Object;
};
export const replaceValForObj = <
  T extends {
    [key: string]: any;
  },
  K extends keyof T
>(
  obj: T,
  fn: (key: keyof T, value: T[K], index: number) => any
): {
  [key: string]: T[K];
} => {
  let m: any = {};
  Object.keys(obj).map((k, id) => {
    const v = obj[k];
    m[k] = fn(k, v, id);
  });
  return m;
};
export const replaceKVForObj = <
  T extends {
    [key: string]: any;
  },
  K extends keyof T
>(
  obj: T,
  fn: (
    key: keyof T,
    value: T[K],
    index: number
  ) => {
    k: string;
    v: any;
  }
): {
  [key: string]: T[K];
} => {
  let m: any = {};
  Object.keys(obj).map((k, id) => {
    const v = obj[k];
    const { k: newK, v: newV } = fn(k, v, id);
    m[newK] = newV;
  });
  return m;
};
export const replaceKeyForObj = <
  T extends {
    [key: string]: any;
  },
  K extends keyof T
>(
  obj: T,
  fn: (key: keyof T, value: T[K], index: number) => any
): {
  [key: string]: T[K];
} => {
  let m: any = {};
  Object.keys(obj).map((k, id) => {
    const v = obj[k];
    m[fn(k, v, id)] = v;
  });
  return m;
};
export const objToStr = (map: any) => {
  let str = ``;
  _.mapKeys(map, (k, v) => {
    str += `${k}:`;
    str += is(v) ? objToStr(v) : v;
    str +
      `
    `;
  });
  return str;
};
export const logObj = (map: any) => {
  console.log(objToStr(map));
};

export const objLength = (obj: any) => {
  return Object.keys(obj).length;
};

export const toObj = (obj: any) => {
  try {
    return JSON.parse(obj);
  } catch (e) {
    return {};
  }
};
