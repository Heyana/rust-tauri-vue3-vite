import fs from 'fs';
import path, { basename } from 'path';
import JSZip from 'jszip';
// 异步函数，读取文件夹中的所有文件（包括子文件夹中的文件）
export async function listFilesInDir(dir: string): Promise<string[]> {
  const files: string[] = [];

  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // 如果是目录，则递归调用自身
      const subFiles = await listFilesInDir(fullPath);
      files.push(...subFiles);
    } else {
      // 如果是文件，则添加到文件列表中
      files.push(fullPath);
    }
  }

  return files;
}

// 主函数，接受文件夹数组，输出所有文件路径
export async function listFilesInDirs(dirs: string[]): Promise<string[]> {
  const allFiles: string[] = [];

  for (const dir of dirs) {
    const filesInDir = await listFilesInDir(dir);
    allFiles.push(...filesInDir);
  }

  return allFiles;
}

export const getFileOrZipBasedSingleFile = async (
  files: {
    name: string;
    buffer: Buffer;
  }[]
) => {
  if (files.length === 1) {
    const file = files[0];
    return {
      name: file.name,
      buffer: Buffer.from(file.buffer)
    };
  } else {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.name, file.buffer));
    console.log('Log-- ', zip, 'zip');
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    console.log('Log-- ', content, 'content');
    return {
      buffer: content,
      name: basename(files[0].name) + '等.zip'
    };
  }
};
