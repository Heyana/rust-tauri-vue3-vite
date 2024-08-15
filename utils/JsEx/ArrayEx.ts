export const filter = <T>(ls: T[]): T[] => ls.filter((i) => i);

export const isEmpty = (ls: any[]) => ls.length === 0;
export const notEmpty = (ls: any[]) => ls.length !== 0;
export const random = (ls: any[]) => {
  const num = Math.random() * ls.length;
  const idx = Math.floor(num);
  return ls[idx];
};

export const isDef = (d1: number[], d2: any[]) => {
  for (let idx = 0; idx < d1.length; idx++) {
    const item1 = d1[idx];
    const item2 = d2[idx];
    if (item1 !== item2) return true;
  }
  return false;
};

export const toArr = <T>(item: T | T[]) => {
  return Array.isArray(item) ? item : [item];
};

export const findThenDel = <T>(ls: T[], fn: (i: T) => boolean): boolean => {
  const find = ls.findIndex(fn);
  if (find === -1) {
    return false;
  }
  ls.splice(find, 1);
  return true;
};

export const findMultiIndex = <T>(ls: T[], fn: (item: T) => boolean) => {
  return ls.map((i, index) => (fn(i) ? index : undefined)).filter((i) => i !== undefined);
};

export const isTrues = <T>(ls: Array<T>) => {
  for (const i of ls) {
    if (!i) return false;
  }
  return true;
};

export function execPromisesWithLimit(map: {
  promiseFns: (() => Promise<void>)[];
  each?: (i: number, result?: any) => void;
  done?: () => void;
  execLength?: number;
}) {
  const { promiseFns, each, done, execLength = 1 } = map;
  // 创建一个队列来存储待执行的函数
  const queue: (() => Promise<void>)[] = [...promiseFns];
  // 创建一个计数器来跟踪当前正在执行的Promise数量
  let executing = 0;
  // 创建一个Promise用于在所有Promise执行完毕后resolve
  const allDone = new Promise<void>((resolve) => {
    // 当队列为空且没有正在执行的Promise时，调用done回调并resolve allDone Promise
    const checkDone = () => {
      if (queue.length === 0 && executing === 0) {
        done?.();
        resolve();
      }
    };
    // 每次Promise解决时调用
    const onPromiseResolved = () => {
      executing--; // 减少正在执行的Promise数量
      checkDone(); // 检查是否所有Promise都已执行完毕
      dequeue(); // 从队列中取出下一个Promise来执行
    };
    // 从队列中取出下一个Promise来执行
    const dequeue = () => {
      if (queue.length > 0 && executing < execLength) {
        const fn = queue.shift()!; // 取出队列中的第一个函数并从队列中移除
        executing++; // 增加正在执行的Promise数量
        fn()
          .then((result) => {
            each?.(queue.length, result); // 调用each回调，传入队列中剩余的函数数量和可能的结果
            onPromiseResolved(); // Promise解决后调用onPromiseResolved
          })
          .catch((error) => {
            console.error('Promise failed:', error);
            onPromiseResolved(); // 即使Promise失败，也减少正在执行的Promise数量并继续执行
          });
      } else {
        checkDone(); // 如果队列为空或已达到同时执行的Promise数量限制，检查是否所有Promise都已执行完毕
      }
    };
    // 开始执行第一个或下一组Promise
    dequeue();
  });

  // 返回allDone Promise，以便调用者可以等待所有Promise执行完毕
  return allDone;
}

export const getIndexByNums = (map: {
  data: number[];
  max: number;
  each(resIdx: number, idx: number): void;
}) => {
  const { data, max, each } = map;
  const all = data.length;
  data.map((_, index) => {
    const tIdx = Math.floor((index / all) * max);
    each(tIdx, index);
  });
};

export const removeSomeElements = <T>(array: T[], condition: (element: T) => boolean): T[] => {
  return array.filter((element) => !condition(element));
};

export function ensureArrayBufferLengthIsMultipleOfFour(
  inputArrayBuffer: ArrayBuffer
): ArrayBuffer {
  // 获取输入ArrayBuffer的长度
  const inputLength = inputArrayBuffer.byteLength;

  // 如果已经是4的倍数，则直接返回原ArrayBuffer
  if (inputLength % 4 === 0) {
    return inputArrayBuffer;
  }

  // 计算需要填充的字节数，使长度成为4的倍数
  const paddingBytes = 4 - (inputLength % 4);

  // 创建一个新的ArrayBuffer，其长度是原长度的四倍数的最小长度
  const outputArrayBuffer = new ArrayBuffer(inputLength + paddingBytes);

  // 将原ArrayBuffer的内容复制到新的ArrayBuffer中
  const inputView = new Uint8Array(inputArrayBuffer);
  const outputView = new Uint8Array(outputArrayBuffer);
  outputView.set(inputView, 0);

  // 如果需要，填充剩余的字节（使用0或其他你想要的值）
  for (let i = inputLength; i < outputArrayBuffer.byteLength; i++) {
    outputView[i] = 0; // 使用0进行填充，你也可以选择其他值
  }

  // 返回新的ArrayBuffer
  return outputArrayBuffer;
}

export function sortNumStr(strs: string[]): string[] {
  return strs.sort((a, b) => {
    // 提取文件名中的数字部分
    const numA = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);

    // 如果数字部分相同，则按文件名排序
    if (numA === numB) {
      return a.localeCompare(b);
    }

    // 根据数字部分排序
    return numA - numB;
  });
}
