import fs, { existsSync, promises } from 'fs';
import path, { basename, dirname } from 'path';
import { promisify } from 'util';
import { removeExtension } from './str';

export const createIfDontExist = (p: string) => {
  try {
    const res = fs.statSync(p);
    if (!res.isDirectory()) {
      fs.mkdirSync(p);
    }
  } catch (e) {
    fs.mkdirSync(p);
  }
};

export function getFilenameWithoutExtension(filePath: string) {
  // 获取文件名（包含后缀）
  const filenameWithExtension = path.basename(filePath);

  // 获取文件后缀
  const extension = path.extname(filePath);

  // 去掉后缀，得到文件名
  const filenameWithoutExtension = filenameWithExtension.slice(0, -extension.length);

  return filenameWithoutExtension;
}

export const getFileInfo = (filePath: string) => {
  try {
    const res = fs.statSync(filePath);
    return res;
  } catch (e) {
    return undefined;
  }
};

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const lstat = promisify(fs.lstat);

export async function removeFilesAndFoldersRecursiveAsync(dirPath: string): Promise<void> {
  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      const curPath = path.join(dirPath, file);
      const stats = await lstat(curPath);

      if (stats.isDirectory()) {
        // 递归调用，删除文件夹内的文件和子文件夹
        await removeFilesAndFoldersRecursiveAsync(curPath);
      } else {
        // 删除文件
        await unlink(curPath);
      }
    }

    // 在这个函数中，我们不删除顶层文件夹本身
  } catch (err) {
    console.error(`处理目录 ${dirPath} 时出错: ${err}`);
  }
}

// 读取目录内容
export const getDir = (filePath: string): string[] | undefined => {
  try {
    const res = fs.readdirSync(filePath);
    return res;
  } catch (e) {
    return undefined;
  }
};

// 读取文件内容
export const readFile = (
  filePath: string,
  encoding: BufferEncoding = 'utf8'
): string | undefined => {
  try {
    const content = fs.readFileSync(filePath, {
      encoding: encoding
    });
    return content;
  } catch (e) {
    return undefined;
  }
};

// 写入文件内容
export const writeFile = (
  filePath: string,
  data: string,
  options: fs.WriteFileOptions = {}
): boolean => {
  try {
    fs.writeFileSync(filePath, data, options);
    return true;
  } catch (e) {
    return false;
  }
};

// 追加文件内容
export const appendFile = (
  filePath: string,
  data: string,
  options: fs.WriteFileOptions = {}
): boolean => {
  try {
    fs.appendFileSync(filePath, data, options);
    return true;
  } catch (e) {
    return false;
  }
};

// 检查文件或目录是否存在
export const exists = (filePath: string): boolean => {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
};

// 删除文件
export const removeFile = (filePath: string): boolean => {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
};

// 创建目录
export const createDirectory = (dirPath: string, mode: number = 0o777): boolean => {
  try {
    fs.mkdirSync(dirPath, mode);
    return true;
  } catch (e) {
    return false;
  }
};

// 删除目录
export const removeDirectory = (dirPath: string): boolean => {
  try {
    fs.rmdirSync(dirPath);
    return true;
  } catch (e) {
    return false;
  }
};

// 列出目录下的所有文件和子目录（递归）
export const listFilesRecursively = (dirPath: string): string[] => {
  try {
    const files = getDir(dirPath);
    if (files) {
      return files.reduce((acc: string[], file: string) => {
        const fullPath = `${dirPath}/${file}`;
        if (fs.statSync(fullPath).isDirectory()) {
          return acc.concat(listFilesRecursively(fullPath));
        } else {
          return acc.concat(fullPath);
        }
      }, []);
    } else {
      return [];
    }
  } catch (e) {
    throw e;
  }
};

// 读取目录内容并过滤文件
export const getFilesInDir = (dirPath: string): string[] => {
  try {
    const files = getDir(dirPath);
    if (files) {
      return files.filter((file: string) => !fs.statSync(`${dirPath}/${file}`).isDirectory());
    } else {
      return [];
    }
  } catch (e) {
    throw e;
  }
};

// 获取文件的创建时间
export function getFileBirthTime(filePath: string): Date {
  return fs.statSync(filePath).birthtime;
}
// 获取文件的创建时间
export function getFileAtime(filePath: string): Date {
  return fs.statSync(filePath).ctime;
}
// 获取文件的创建时间
export function getFileChangeTime(filePath: string): Date {
  return fs.statSync(filePath).mtime;
}

// 根据文件的创建时间生成新的文件名
export function generateNewFileName(birthTime: Date): string {
  return `${birthTime.getFullYear()}${String(birthTime.getMonth() + 1).padStart(2, '0')}${String(
    birthTime.getDate()
  ).padStart(2, '0')}_${String(birthTime.getHours()).padStart(2, '0')}${String(
    birthTime.getMinutes()
  ).padStart(2, '0')}${String(birthTime.getSeconds()).padStart(2, '0')}`;
}

// 复制文件到processed文件夹并重命名
export function copyAndRenameFile(
  sourcePath: string,
  processedFolder: string,
  onlyRename: boolean = false
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const birthTime = getFileBirthTime(sourcePath);
      const newFileName = generateNewFileName(birthTime);
      const extension = path.extname(sourcePath);
      const newFilePath = path.join(processedFolder, `${newFileName}${extension}`);
      if (existsSync(newFilePath)) {
        console.log('Log-- ', `文件 ${newFilePath} 已存在，跳过处理`);
        return resolve(true);
      }

      await promises.copyFile(sourcePath, newFilePath);

      console.log(`文件 ${sourcePath} 已处理并保存为 ${newFileName}`);
      return resolve(true);
    } catch (error) {
      console.error(`处理文件 ${sourcePath} 时发生错误:`, error);
      return resolve(false);
    }
  });
}

// 复制文件到processed文件夹并重命名
export function renameFileToDate(sourcePath: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const birthTime = getFileBirthTime(sourcePath);

      const newFileName = generateNewFileName(birthTime);
      const extension = path.extname(sourcePath);
      const newFilePath = path.join(dirname(sourcePath), `${newFileName}${extension}`);
      if (existsSync(newFilePath)) {
        console.log('Log-- ', `文件 ${newFilePath} 已存在，跳过处理`);
        return resolve(true);
      }

      await promises.rename(sourcePath, newFilePath);

      console.log(`文件 ${sourcePath} 已处理并保存为 ${newFileName}`);
      return resolve(true);
    } catch (error) {
      console.error(`处理文件 ${sourcePath} 时发生错误:`, error);
      return resolve(false);
    }
  });
}
// 复制文件到processed文件夹并重命名
export function renameFileToChangeDate(sourcePath: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const changeTime = getFileChangeTime(sourcePath);

      const newFileName = generateNewFileName(changeTime);
      const extension = path.extname(sourcePath);
      const newFilePath = path.join(dirname(sourcePath), `${newFileName}${extension}`);
      if (existsSync(newFilePath)) {
        console.log('Log-- ', `文件 ${newFilePath} 已存在，跳过处理`);
        return resolve(true);
      }

      await promises.rename(sourcePath, newFilePath);

      console.log(`文件 ${sourcePath} 已处理并保存为 ${newFileName}`);
      return resolve(true);
    } catch (error) {
      console.error(`处理文件 ${sourcePath} 时发生错误:`, error);
      return resolve(false);
    }
  });
}
function convertTimestampToYYYYMMDD_HHMMSS(timestamp: string): string {
  // 假设 timestamp 是以 "YYYYMMDDHHMMSS" 格式提供的
  // 直接返回格式化的字符串，在日期和时间之间添加一个下划线
  return `${timestamp.slice(0, 8)}_${timestamp.slice(8)}`;
}

export const renamePocket3ToYYYYMMDD = (str: string): string => {
  const fileNameParts = path.basename(str).split('_');
  const dateTimeString = fileNameParts[1];

  // 将提取的日期时间字符串拆分为年月日和时分秒

  console.log('Log-- ', dateTimeString, 'dateTimeString');
  // 构造新的文件名
  return convertTimestampToYYYYMMDD_HHMMSS(dateTimeString);
};

const formatVideoName = (oldName: string): string => {
  // 将每个'——'替换为'_'，忽略单独的'—'
  let newName = oldName.split('——').join('_');

  // 检查是否有'_数字'作为后缀，如果有则移除
  const lastUnderscoreIndex = newName.lastIndexOf('_');
  console.log('Log-- ', lastUnderscoreIndex, 'lastDotIndex');
  const suffix = newName.slice(lastUnderscoreIndex);
  const suffixNumber = parseInt(suffix.slice(1));
  console.log('Log-- ', newName, suffixNumber, 'suffixNumber');
  if (!isNaN(suffixNumber)) {
    newName = newName.slice(0, lastUnderscoreIndex);
  }

  return newName;
};

// 复制文件到processed文件夹并重命名
export function renameFileToFormat(sourcePath: string, newName?: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const newFileName = newName || formatVideoName(removeExtension(sourcePath));
      console.log('Log-- ', newFileName, 'newFileName');
      const newFilePath = path.join(`${newFileName}${path.extname(sourcePath) || '.mp4'}`);
      if (existsSync(newFilePath)) {
        console.log('Log-- ', `文件 ${newFilePath} 已存在，跳过处理`);
        return resolve(true);
      }

      await promises.rename(sourcePath, newFilePath);

      console.log(`文件 ${sourcePath} 已处理并保存为 ${newFileName}`);
      return resolve(true);
    } catch (error) {
      console.error(`处理文件 ${sourcePath} 时发生错误:`, error);
      return resolve(false);
    }
  });
}
