import { md5 } from '@allex/md5';
import axios, { ResponseType } from 'axios';
import _ from 'lodash';
import { ex } from './JsEx/jsEx';
import { getFileExtension } from './str';
// import * as map from "js-funcs";
export * as arrEx from './JsEx/ArrayEx';
export const base64ToArrayBuffer = async (base64: string) => {
  if (base64.indexOf(',') !== -1) base64 = getTruthBase64(base64);
  const binaryStr = window.atob(base64);
  const byteLength = binaryStr.length;
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes.buffer;
};

export const getTruthBase64 = (base64: string) => {
  return base64.substring(base64.indexOf(',') + 1);
};

export const arrayBufferToBlobUr = (ar: ArrayBuffer) => {
  return URL.createObjectURL(new Blob([ar]));
};

export const arrayBufferToBase64 = (ar: ArrayBuffer) => {
  let binaryStr = '';
  const bytes = new Uint8Array(ar);
  for (let i = 0, len = bytes.byteLength; i < len; i++) {
    binaryStr += String.fromCharCode(bytes[i]);
  }
  return 'data:image/jpg;base64,' + window.btoa(binaryStr);
};
export const isDef = (d1: any, d2: any, _each?: (val: any) => any) => {
  if (d1 instanceof Array) {
    return ex.arr.isDef(d1, d2);
  }
  if (_.isObject(d1) && _.isObject(d2)) {
    return ex.obj.isDef(d1, d2);
  }
  return d1 !== d2;
};
export const getDiff = (base: any, other: any, _back: any = {}) => {
  const map: any = {};
  if (!other) return base;
  _.mapKeys(base, (v, k) => {
    console.log('Log-- ', k, v, 'k,v');
    const v2 = other[k];
    const def1 = isDef(v, v2);
    if (!def1) return;
    map[k] = v2;
  });
  return map;
};

export const urlToBlob = async (url: string): Promise<Blob> => {
  return (
    await axios.get(url, {
      responseType: 'blob'
    })
  ).data;
};

export const base64ToBlob = (base64: string): Blob => {
  let arr = base64.split(','),
    mime = (arr[0] as any).match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// export const fileToBlob = async (file: File): Promise<Blob> => {
//   return base64ToBlob((await map.parseFile(file, "base64")) as any);
// };

export const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName);
};

export const getTypeByBase64 = (base64: string) => {
  return base64.substring(base64.indexOf(':') + 1, base64.indexOf(';'));
};

export const transByte = (byte: number) => {
  let size = '';
  if (byte < 0.1 * 1024) {
    // 小于0.1KB，则转化成B
    size = `${byte.toFixed(2)}B`;
  } else if (byte < 1 * 1024 * 1024) {
    // 小于0.1MB，则转化成KB
    size = `${(byte / 1024).toFixed(2)}KB`;
  } else if (byte < 1 * 1024 * 1024 * 1024) {
    // 小于0.1GB，则转化成MB
    size = `${(byte / (1024 * 1024)).toFixed(2)}M`;
  } else {
    // 其他转化成GB
    size = `${(byte / (1024 * 1024 * 1024)).toFixed(2)}G`;
  }
  const sizeStr = `${size}`; // 转成字符串
  const index = sizeStr.indexOf('.'); // 获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2); // 获取小数点后两位的值
  // eslint-disable-next-line eqeqeq
  if (dou == '00') {
    // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
};

export const getMd5 = (data: ArrayBuffer | string): string => {
  return md5(data);
};
export const fileAndBlobToCanvas = (
  fileDataURL: string,
  size: {
    width: number;
    height: number;
  }
): Promise<{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}> => {
  const { width, height } = size;
  let img = new Image();
  img.src = fileDataURL;
  img.width = width;
  img.height = height;

  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext('2d') as any;
  return new Promise((s) => {
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      s({
        canvas,
        ctx
      });
    };
  });
};

export const getCanvas = (
  blob: Blob | string,
  options?: {
    sizeRatio?: number;
    width?: number;
  }
): Promise<{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dispose: () => void;
}> => {
  const { sizeRatio, width: inputWidth } = {
    width: -1,
    sizeRatio: 1,
    ...options
  };
  const isBlob = blob instanceof Blob;
  const url = isBlob ? URL.createObjectURL(blob) : blob;
  let img = new Image();
  img.src = url;
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d') as any as CanvasRenderingContext2D;
  return new Promise((s) => {
    img.onload = function () {
      const { width, height } = img;
      const ratio = width / height;
      canvas.width =
        sizeRatio === 1
          ? inputWidth !== -1
            ? inputWidth > width
              ? width
              : inputWidth
            : width * sizeRatio
          : width;

      canvas.height =
        sizeRatio === 1
          ? inputWidth !== -1
            ? inputWidth > width
              ? height
              : inputWidth / ratio
            : height
          : height;
      height * sizeRatio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      s({
        canvas,
        ctx,
        dispose: () => {
          img.remove();
          canvas.remove();
          isBlob && URL.revokeObjectURL(url);
        }
      });
    };
  });
};
export const getFilesByDataTransfer = (data: DataTransfer | null): File[] => {
  return new Array(data?.files.length)
    .fill(0)
    .map((_, index) => data?.files.item(index))
    .filter((i) => i !== null) as File[];
};
export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: 'image/png' | 'image/webp' | 'image/jpeg' = 'image/png',
  options?: {
    quality?: number;
  }
): Promise<Blob> => {
  const { quality } = {
    quality: 1,
    ...options
  };
  console.log(quality, 'quality');
  return new Promise((s) => {
    canvas.toBlob(
      (blob) => {
        s(blob as Blob);
      },
      type,
      quality
    );
  });
};

export const getRes = (url: string, type?: ResponseType) => {
  return axios
    .get(url, {
      responseType: type || 'arraybuffer'
    })
    .then((i) => i.data)
    .catch((e) => {
      console.log(e, '加载出错');
    });
};
export const mergeObject = <T extends any>(base: T, cover?: T): T => {
  return Object.assign(base as any, cover || {}) as any;
};
export const getMacro = (macroTaskFn: Function, time = 0) => {
  let tempTimer: any = setTimeout(() => {
    tempTimer !== null && clearTimeout(tempTimer);
    tempTimer = null;
    return macroTaskFn();
  }, time);
};
export const clone = (obj: any) => {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  var newObj = new obj.constructor(); //保持继承链
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      //不遍历其原型链上的属性
      var val = obj[key];
      newObj[key] = val;
    }
  }
  return newObj;
};

export const getNamesByNum = (baseName: string, length: any, beginNum = 1, endName: string) => {
  return (new Array(length) as any).fill('').map((_: any, index: number) => {
    const nowIndex = index + beginNum;
    return baseName + nowIndex + (endName ? endName : '');
  });
};

export const getType = (input: File | Blob) => {
  return input.toString().replace(/(\[object )([a-zA-Z]+)(])/, '$2');
};
// export const deepMergeObject = (base: any, other: any) => {
//   map.mapObj(base, (type, val) => {
//     let newVal = other[type];
//     if (newVal === undefined) return;
//     if (getType(val) === "Object" && getType(newVal) === "Object") {
//       newVal = deepMergeObject(val, newVal);
//     }
//     base[type] = newVal;
//   });
//   return base;
// };
export const getArrIndexByItem = <T>(arr: T[], item: T) => arr.find((i) => i === item);

export const getProgress = (num1: number, num2: number, percentage = false) => {
  let v = num1 / num2;
  if (percentage) v *= 100;
  return Number(v.toFixed(2));
};

export const bufferToArrayBuffer = (buf: Buffer) => {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
};

export const isEmpty = (val: any) => {
  if (val === undefined || val === null) return true;
  if (Array.isArray(val)) {
    return val.length === 0;
  }
  if (typeof val === 'string') {
    return val.length === 0;
  }
  if (typeof val === 'number') {
    return val === 0;
  }
  if (typeof val === 'object') {
    return Object.keys(val).length === 0;
  }
};

export const isBlob = (blob: any) => {
  return blob && blob instanceof Blob;
};
export const getTime = (day: number) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const date = new Date();
  date.setTime(date.getTime() + oneDay * day);
  return date.getTime();
};
const key = 'gltf-version-2.0';
export const toCode = (str: string) => {
  //加密字符串
  //定义密钥，36个字母和数字
  var st = key.length; //获取密钥的长度
  var a = key.split(''); //把密钥字符串转换为字符数组
  var s = '',
    b,
    b1,
    b2,
    b3; //定义临时变量
  for (var i = 0; i < str.length; i++) {
    //遍历字符串
    b = str.charCodeAt(i); //逐个提取每个字符，并获取Unicode编码值
    b1 = b % st; //求Unicode编码值得余数
    b = (b - b1) / st; //求最大倍数
    b2 = b % st; //求最大倍数的于是
    b = (b - b2) / st; //求最大倍数
    b3 = b % st; //求最大倍数的余数
    s += a[b3] + a[b2] + a[b1]; //根据余数值映射到密钥中对应下标位置的字符
  }
  return s; //返回这些映射的字符
};
export const fromCode = (str: string) => {
  //定义密钥，36个字母和数字
  var st = key.length; //获取密钥的长度
  var b,
    b1,
    b2,
    b3,
    d = 0,
    s; //定义临时变量
  s = new Array(Math.floor(str.length / 3)); //计算加密字符串包含的字符数，并定义数组
  b = s.length; //获取数组的长度
  for (var i = 0; i < b; i++) {
    //以数组的长度循环次数，遍历加密字符串
    b1 = key.indexOf(str.charAt(d)); //截取周期内第一个字符串，计算在密钥中的下标值
    d++;
    b2 = key.indexOf(str.charAt(d)); //截取周期内第二个字符串，计算在密钥中的下标值
    d++;
    b3 = key.indexOf(str.charAt(d)); //截取周期内第三个字符串，计算在密钥中的下标值
    d++;
    s[i] = b1 * st * st + b2 * st + b3; //利用下标值，反推被加密字符的Unicode编码值
  }
  b = eval('String.fromCharCode(' + s.join(',') + ')');
  return b; //返回被解密的字符串
};

export const getResByFile = (file: File | Blob, type: 'arrayBuffer') => {
  const fileReader: FileReader = new FileReader();
  if (type === 'arrayBuffer') {
    fileReader.readAsArrayBuffer(file);
  }
  return new Promise((s) => {
    fileReader.addEventListener('load', (event) => {
      const arrayBuffer = event.target?.result;
      s(arrayBuffer);
      //...
    });
  });
};

export const getFilesFromFileList = (f: FileList) => {
  const l: File[] = [];
  for (let index = 0; index < f.length; index++) {
    const el = f.item(index);
    if (el) {
      l.push(el);
    }
  }
  return l;
};
export type FilterFileType = 'image' | 'any';
export const filterFiles = (f: File[], type: FilterFileType) => {
  return type === 'any' ? f : f.filter((i) => i.type.indexOf(type) !== -1);
};
// export class MapEx<T, F> extends Map<T, F> {
//   constructor(obj?: { [key: string]: F }) {
//     if (!obj) {
//       super();
//       return;
//     }
//     const ls = map.mapObj(obj, (k, v) => {
//       return [k, v];
//     });
//     // @ts-ignore
//     super(ls);
//   }
//   toArray(type: "key"): T[];
//   toArray(type: "value"): F[];
//   toArray(type: "key" | "value") {
//     let ls :any[]= [];
//     for (const map of this.entries()) {
//       if (type == "key") {
//         ls.push(map[0]);
//       } else {
//         ls.push(map[1]);
//       }
//     }
//     return ls;
//   }
//   map(fn: (k: T, v: F) => any) {
//     return [...this.entries()].map((i) => {
//       const [k, v] = i;
//       return fn(k, v);
//     });
//   }
//   toJSON() {
//     const map = {};
//     this.forEach((val: any, key: any) => {
//       map[key] = val;
//     });
//     return map;
//   }
//   toString() {
//     return JSON.stringify(this.map);
//   }
//   filterData(fn: (k: T, v: F) => boolean): { key: T; val: F }[] {
//     let ls:any[] = [];
//     for (const [k, v] of this.entries()) {
//       const res = fn(k, v);
//       if (!res) continue;
//       ls.push({ key: k, val: v });
//     }
//     return ls;
//   }
//   find(fn: (k: T, v: F) => boolean): undefined | F {
//     for (const [k, v] of this.entries()) {
//       const res = fn(k, v);
//       if (!res) continue;
//       return v;
//     }
//   }
//   static formJSON(json: map.Obj): MapEx<any, any> {
//     return new MapEx(json);
//   }
//   copy(map: MapEx<T, F>) {
//     map.map((k, v) => this.set(k, v));
//   }
//   clone() {
//     const map = new MapEx<T, F>();
//     this.map((k, v) => map.set(k, v));
//     return map;
//   }
//   index(idx: number, type: "key"): T | undefined;
//   index(idx: number, type: "value"): F | undefined;
//   index(idx: number, type: "key" | "value" = "key"): any {
//     return this.toArray(type as any)[idx];
//   }
// }

export const toTimeString = (time: Date) => {
  if (!time) return;
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  return y + '/' + m + '/' + d;
};

export const rmPartOfString = (base: string, rmPart: string) => {
  return base.replace(new RegExp(rmPart), '');
};

export const rmArrEle = (ls: any[], item: any) => {
  const index = ls.findIndex((i) => i === item);
  if (index === -1) return;
  ls.splice(index, 1);
  return index;
};

export const addElesFromIndexToArr = (ls: any[], item: any | any[], index: number) => {
  const items = Array.isArray(item) ? item : [item];
  return ls.splice(index, 0, ...items);
};

// export const getImgSizeByPath = (
//   p: string
// ): {
//   width: number;
//   height: number;
//   type: string;
// } => {
//   return (sizeOf as any)(p);
// };

// export const eachPromises = <T>(ls: Promise<T>[], done?: (res: T[]) => {}) => {
//   await ls.shift();
// };

export class LimitCall<T extends Function> {
  private timer: NodeJS.Timeout | null = null;
  time = 0;
  fn: T;
  constructor(time: number, fn: T) {
    this.time = time;
    this.fn = fn;
  }
  get = () =>
    ((...any: any[]) => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.fn(...any);
      }, this.time);
    }) as any as T;
}

export const extToMime = (ext: string) => {
  let str = '';
  if (ext === 'png') {
    str = 'image/png';
  } else if (ext === 'jpg') {
    str = 'image/jpeg';
  } else if (ext === 'webp') {
    ext = 'image/webp';
  }
  return str;
};

// export const getFilesBy

export const sleep = (time: number) => {
  return new Promise((s) => {
    setTimeout(() => {
      s(0);
    }, time);
  });
};

export const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.webm']; // 可根据需要添加其他视频文件扩展名

  const fileExtension = url.substring(url.lastIndexOf('.')).toLowerCase().trim();
  return videoExtensions.includes(fileExtension);
};
export const isAudioFile = (url: string): boolean => {
  const audioExtensions = ['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a']; // 可根据需要添加其他音频文件扩展名

  const fileExtension = url.substring(url.lastIndexOf('.')).toLowerCase().trim();
  return audioExtensions.includes(fileExtension);
};

export const exitFull = () => {
  console.log(890, '890');
  const doc = document as any;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.webkitCancelFullScreen) {
    doc.webkitCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  } else {
    for (const key in doc) {
      const a = doc[key];
      if (key.toLowerCase().includes('exitfullscreen')) {
        a.call(doc);
      }
    }
  }
};

export const toFull = () => {
  var element = document.documentElement as any;

  console.log([element], 'element');
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // 兼容火狐
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // 兼容谷歌
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // 兼容IE
    element.msRequestFullscreen();
  } else {
    for (const key in element) {
      const a = element[key];
      if (key.includes('Fullscreen')) {
        a.call(element);
      }
    }
  }
};

export const copyText = (row: string) => {
  const text = row;
  const oInput = document.createElement('input'); // 创建一个隐藏input（重要！）
  oInput.value = text;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand('Copy'); // 执行浏览器复制命令
  oInput.remove();
};

export const getDataType = (
  input: any
):
  | 'string'
  | 'number'
  | 'boolean'
  | 'undefined'
  | 'null'
  | 'array'
  | 'promise'
  | 'object'
  | 'symbol'
  | 'function'
  | 'bigint'
  | 'unknown' => {
  switch (typeof input) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'undefined':
      return 'undefined';
    case 'object':
      if (input === null) {
        return 'null';
      } else if (Array.isArray(input)) {
        return 'array';
      } else if (typeof input.then === 'function') {
        // 假设我们将 Promise 识别为 'promise' 类型
        return 'promise';
      } else {
        return 'object';
      }
    case 'symbol':
      return 'symbol';
    case 'function':
      return 'function';
    case 'bigint':
      return 'bigint';
    default:
      return 'unknown';
  }
};
export const formatDateToMinutes = (number: string) => {
  var time = new Date(Number(number));
  var year = time.getFullYear();
  console.log('Log-- ', time, year, 'year');
  var month = (1 + time.getMonth()).toString().padStart(2, '0'); // 月份从0开始，所以需要加1
  var day = time.getDate().toString().padStart(2, '0');
  var hours = time.getHours().toString().padStart(2, '0');
  var minutes = time.getMinutes().toString().padStart(2, '0');

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
};
export function extractNumbersFromString(str: string): number[] {
  const regex = /(\d+(\.\d+)?)/g;
  const matches = str.match(regex) || [];
  return matches.map(Number);
}

export function getRatioIndex(data: number[], maxIndex: number): number[] {
  // 计算比值并排序索引
  const sortedIndices = data
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value) // 降序排序，比值最大的排在最前面
    .map((item) => item.index);

  // 分配整数索引，最大索引不超过maxIndex
  const ratioIndexes = sortedIndices.slice(0, maxIndex).map((_, i) => maxIndex - i);

  return ratioIndexes.sort((a, b) => a - b);
}
export const rmSpecialStr = (str: string) => {
  return str.replace(/[^a-zA-Z0-9]/g, '');
};

export const getUserAgent = () => {
  if (
    navigator.userAgent.indexOf('Safari') !== -1 &&
    navigator.userAgent.indexOf('Chrome') === -1
  ) {
    return 'safari';
  } else {
    return 'chrome';
  }
};

export const replaceText = (text: string, oldText: string, newText: string): string => {
  return text?.replace ? text.replace(new RegExp(oldText, 'g'), newText) : text;
};

export const trimString = (map: { str: string; before: number; after: number }): string => {
  const { str, before, after } = map;
  if (str.length < before + after) {
    return str;
  }

  return str.slice(before, str.length - after);
};

export const countSubstringOccurrences = (text: string, substring: string): number => {
  let count = 0;
  let position = 0;

  while ((position = text.indexOf(substring, position)) !== -1) {
    count++;
    position += substring.length;
  }

  return count;
};
export function countSubstringOccurrencesIgnoreCase(text: string, substring: string): number {
  const lowerText = text.toLowerCase();
  const lowerSubstring = substring.toLowerCase();
  return countSubstringOccurrences(lowerText, lowerSubstring);
}

export const toBlob = (val: any) => {
  if (_.isObject(val)) {
    return new Blob([JSON.stringify(val)], { type: 'application/json' });
  } else {
    return new Blob([val], { type: 'application/json' });
  }
};
export function analyzeNestedObjectValues(obj: any): Map<any, number> {
  const valueCounts = new Map<any, number>();

  function traverse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach((item) => traverse(item));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach((value) => traverse(value));
    } else {
      if (valueCounts.has(obj)) {
        valueCounts.set(obj, valueCounts.get(obj)! + 1);
      } else {
        valueCounts.set(obj, 1);
      }
    }
  }

  traverse(obj);
  return valueCounts;
}
export const parseStrByWorker = (str: string): Promise<any> => {
  const code = `  
    self.onmessage = function(event) {  
        // 你的代码逻辑  
        self.postMessage(JSON.parse(event.data));  
    };  
`;

  const blob = new Blob([code], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  // console.time('1')
  // 发送消息给worker，并监听回复
  worker.postMessage(str);
  return new Promise((s) => {
    worker.onmessage = function (event) {
      // console.timeEnd('1')
      // console.log('Worker result:', event.data);
      s(event.data);
    };
  });
};
export function isImageFile(file: File): boolean {
  const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
    // 你可以添加更多图片MIME类型
  ];

  return imageMimeTypes.includes(file.type);
}
export function isImagePath(file: string): boolean {
  const imageMimeTypes = [
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.heic',
    '.heif'
    // 你可以添加更多图片MIME类型
  ];

  return imageMimeTypes.includes(getFileExtension(file.toLocaleLowerCase()));
}
export function isVideoFile(file: File): boolean {
  const imageMimeTypes = [
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/mkv',
    'video/flv',
    'video/wmv',
    'video/webm',
    'video/x-matroska'
    // 你可以添加更多图片MIME类型
  ];

  return imageMimeTypes.includes(file.type);
}
