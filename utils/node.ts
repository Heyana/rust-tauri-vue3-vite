import crypto from 'crypto';
import fs from 'fs';
import { rimrafSync } from 'rimraf';
import { pipeline } from 'stream/promises';
import { Stats, WriteFileOptions } from 'fs';

import path, { basename, dirname, extname } from 'path';
import { arrEx, canvasToBlob, getCanvas, getResByFile, mergeObject } from './js';
import MapEx from './JsEx/MapEx';
import { readdir } from 'fs/promises';
// 创建用于生成MD5哈希的流
export const createHashStream = () => {
  return crypto.createHash('md5');
};

export const createMd5FromPath = async (filePath: string): Promise<string | null> => {
  const readStream = fs.createReadStream(filePath);
  const hashStream = createHashStream();
  try {
    await pipeline(readStream, hashStream);
    return hashStream.digest('hex');
  } catch (err) {
    console.error(`Error hashing file ${filePath}:`, err);
    return null;
  }
};

export const pJoin = path.join;

export type CoverImgToWebpOptions = {
  deleteOrigin: boolean;
  each?: (file: File) => void;
  type?: 'webp' | 'png' | 'jpg';
  quality?: number;
};

export const getDirName = (dir: string) => {
  return dirname(dir);
};
export const getName = (path: string) => {
  return basename(path, extname(path));
};

export const getDirsByNameFromPath = async (
  dir: string,
  name: string,
  rtList: Set<string> = new Set(),
  options?: {
    searchDepth: number;
    beforeAll?: (dirs: string[]) => void;
    beforeEach?: (dir: string) => void;
    trigger?: boolean;
  }
): Promise<Set<string>> => {
  const { searchDepth, beforeAll, beforeEach, trigger } = mergeObject(
    {
      searchDepth: -1,
      trigger: true
    },
    options
  );
  if (searchDepth === 0 || !fs.existsSync(dir)) return rtList;
  return new Promise(async (s, j) => {
    try {
      const infos = fs.readdirSync(dir);
      if (trigger) beforeAll?.(infos);
      for (const dirent of infos) {
        const childPath = path.join(dir, dirent);
        if (trigger) beforeEach?.(childPath);
        const state = fs.statSync(childPath);
        if (state.isFile()) continue;
        if (dirent === name) {
          // console.log(`正在删除${subDir}`);
          // rimraf.sync(subDir);
          rtList.add(childPath);
        } else {
          getDirsByNameFromPath(childPath, name, rtList, {
            ...options,
            searchDepth: searchDepth - 1,
            trigger: false
          });
        }
      }
    } catch (error) {
      console.error(error);
      j(error);
    }
    s(rtList);
  });
};

export const deleteDirs = (
  dirs: string[],
  options?: {
    each?: (dir: string) => void;
  }
) => {
  const { each } = mergeObject({}, options);
  return new Promise((s) => {
    const re = async (ls: string[], index: number = 0) => {
      const dir = ls[index];
      if (!dir) return s(0);
      rimrafSync(dir);
      each?.(dir);
      re(ls, ++index);
    };
    re(dirs);
  });
};

export const getFileInfo = (p: string) => {
  return fs.statSync(p);
};

export const hasFile = (path: string) => {
  return fs.existsSync(path);
};

export const rename = (oldName: string, newName: string, base?: string) => {
  console.log(oldName, newName, base, 'oldName,newName,base');
  if (base) {
    oldName = path.join(base, oldName);
    newName = path.join(base, newName);
  }
  if (hasFile(newName)) return false;
  try {
    fs.renameSync(oldName, newName);
    return true;
  } catch (e) {
    return false;
  }
};

export const createDir = (p: string) => {
  try {
    fs.mkdirSync(p);
    return true;
  } catch (e) {
    return false;
  }
};

export const writeFile = (p: string, data: any, options?: WriteFileOptions) => {
  try {
    fs.writeFileSync(p, data);
    return true;
  } catch (e) {
    return false;
  }
};

export const readFile = (p: string, options?: BufferEncoding): undefined | Buffer => {
  try {
    return fs.readFileSync(p, options as any);
  } catch (e) {
    return undefined;
  }
};

export const copyFile = (src: string, newPath: string) => {
  try {
    fs.copyFileSync(src, newPath);
  } catch (e) {
    return false;
  }
};
export const copyDir = (map: { srcPath: string; targetPath: string; isCover: boolean }) => {
  const { srcPath, targetPath, isCover } = map;
  // 判断源路径是否存在
  if (!fs.existsSync(srcPath)) {
    console.log(`源路径 ${srcPath} 不存在！`);
    return;
  }
  // 判断目标路径是否存在，不存在则创建目标路径
  if (fs.existsSync(targetPath)) {
    if (!isCover) return;
  } else {
    fs.mkdirSync(targetPath);
  }
  // 读取源路径中的所有文件和子文件夹
  const files = fs.readdirSync(srcPath);

  // 循环遍历文件和子文件夹，并实现复制
  for (const fileName of files) {
    // 创建源文件/子文件夹的完整路径
    const srcFilePath = path.join(srcPath, fileName);
    // 创建目标文件/子文件夹的完整路径
    const targetFilePath = path.join(targetPath, fileName);
    // 获取文件/子文件夹的状态信息
    const stat = fs.statSync(srcFilePath);
    if (stat.isFile()) {
      // 如果是文件，则直接复制
      fs.copyFileSync(srcFilePath, targetFilePath);
      console.log(`复制文件 ${srcFilePath} 到 ${targetFilePath}`);
    } else if (stat.isDirectory()) {
      // 如果是子文件夹，则递归调用 copyDir 函数
      copyDir({
        srcPath: srcFilePath,
        targetPath: targetFilePath,
        isCover
      });
    }
  }
};

export const readDir = (p: string): string[] | undefined => {
  try {
    return fs.readdirSync(p);
  } catch (e) {
    return undefined;
  }
};

let a = false;
// const _eachFileForDir = (map: {
//   dir: string;
//   deep?: boolean;
//   each?: (fileName: string, info: Stats | null, nowDir: string) => void;
//   done?: () => void;
//   files: SetEx<string>;
//   doneFiles: SetEx<string>;
// }) => {
//   const { dir, deep, each, done } = map;
//   const files = readDir(dir);
//   map.files.add(files);
//   files.map((p) => {
//     const childDir = path.join(dir, p);
//     fs.statSync(childDir, (e, stats) => {
//       each?.(p, e ? null : stats, dir);
//       if (e && !a) {
//         a = true;
//         console.log(e, "e");
//       }
//       if (deep && stats.isDirectory()) {
//         const newMap = { ...map, dir: childDir };
//         _eachFileForDir(newMap);
//       }
//     });
//   });
// };

const _eachFileForDir = (map: {
  dir: string;
  deep?: boolean;
  each?: (fileName: string, info: Stats | null, nowDir: string) => void;
  done?: () => void;
  doneMap: MapEx<string, boolean>;
  trigger: () => void;
}) => {
  const { dir, deep, each, done } = map;
  const files = readDir(dir);
  files?.map((p) => {
    const childDir = path.join(dir, p);
    const stat = fs.statSync(childDir);
    each?.(p, stat, dir);
    if (stat.isDirectory() && deep) {
      const newMap = { ...map, dir: childDir };
      map.doneMap.set(childDir, false);
      _eachFileForDir(newMap);
    }
  });
  map.doneMap.set(dir, true);
  const ok = arrEx.isTrues(map.doneMap.toArray('value'));
  if (ok) {
    map.trigger();
  }
};

export const analysisDir = (map: { dir: string; deep: boolean; ls?: Set<string> }) => {
  const inputMap = mergeObject({ ls: new Set<string>(), dir: '', deep: false }, map);
  const { dir, deep, ls } = inputMap;
  console.log(deep, 'deep');
  const files = readDir(dir);
  files?.map((i) => {
    const tPath = path.join(dir, i);
    ls?.add(tPath);
    if (!deep) return;
    fs.stat(tPath, (e, stats) => {
      if (e) return;
      if (stats.isDirectory()) {
        analysisDir({
          ...inputMap,
          dir: tPath
        })?.forEach((i) => ls?.add(i));
      }
    });
  });
  return ls;
};
export const moveDir = (oldPath: string, newPath: string): Promise<any> => {
  createDir(newPath);
  return readdir(oldPath).then(async (files) => {
    //遍历读取到的文件列表
    return new Promise(async (s) => {
      await Promise.all(
        files.map(async (filename) => {
          //获取当前文件的绝对路径
          return new Promise(async (s) => {
            const filedir = path.join(oldPath, filename);
            const stat = await fs.promises.stat(filedir);
            var isFile = stat.isFile(); //是文件
            if (isFile) {
              // 通过重命名移动文件到根目录
              await rename(filedir, path.join(newPath, filename));
            } else {
              const newDirPath = path.join(newPath, filename);
              //递归，如果是文件夹，就继续遍历该文件夹下面的文件
              await moveDir(filedir, newDirPath);
              rmDir(filedir);
            }
            s(0);
          });
          //根据文件路径获取文件信息，返回一个fs.Stats对象
        })
      );
      rmDir(oldPath);
      s(0);
    });
  });
};
// export const
export const rmDir = (p: string) => {
  if (!hasFile(p)) return;
  try {
    rimrafSync(p);
  } catch (e) {
    console.log(e, 'e');
  }
};

export const rmDirs = (() => {
  const re = async (ls: string[], index: number, resolve: Function, each?: Function) => {
    const dir = ls[index];
    if (!dir) return resolve();
    rimrafSync(dir);
    each?.(dir);
    re(ls, ++index, resolve, each);
  };
  return (
    dirs: string[],
    options?: {
      each?: (dir: string) => void;
    }
  ) => {
    const { each } = mergeObject({}, options);
    return new Promise((s) => {
      re(dirs, 0, s, each);
    });
  };
})();

export const getFileName = (p: string) => {
  return path.basename(p);
};
export const ArrayBufferToBuffer = (ab: ArrayBuffer) => {
  return Buffer.from(ab);
};
/**
 *  从什么转为什么
 *  ArrayBuffer To Buffer
 *  从什么获取出什么
 *  get Name From Path
 *  */

export const notHasCreateDir = (p: string) => {
  try {
    const res = fs.statSync(p);
    if (!res.isDirectory()) {
      fs.mkdirSync(p);
    }
  } catch (e) {
    fs.mkdirSync(p);
  }
};
export const supportVideoExt = ['.mp4', '.mov', '.ts'];
export const isVideoPaths = (path: string | string[]) => {
  return arrEx.toArr(path).filter((i) => supportVideoExt.includes(extname(i).toLocaleLowerCase()));
};

export const isVideoPath = (path: string) => {
  return supportVideoExt.includes(extname(path).toLocaleLowerCase());
};

export const hasDir = (p: string) => {
  try {
    const res = fs.statSync(p);
    return res?.isDirectory();
  } catch (e) {
    return false;
  }
};

export const rmFile = (p: string | string[]) => {
  return Promise.all(
    arrEx.toArr(p).map((p) => {
      return new Promise((s) => {
        s(rimrafSync(p));
      });
    })
  );
};
