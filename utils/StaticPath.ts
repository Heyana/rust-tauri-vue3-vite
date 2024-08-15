// 这里定义了静态文件路径的位置
import { join } from 'path';
import { app } from 'electron';
import { URL } from 'url';
import { createIfDontExist } from './fs';
const isDev = process.env.NODE_ENV === 'development';
class StaticPath {
  __db: string;
  __company: string;

  getPath = (path: string) => {
    return join(this.__static, path);
  };
  constructor() {
    const basePath = isDev ? join(__dirname, '..', '..') : join(app.getAppPath(), '..', '..');
    console.log('Log-- ', basePath, isDev, 'basePath,isDev');
    if (isDev) {
      this.__static = join(basePath, 'static');
    } else {
      this.__static = join(__dirname, '..', 'render');
    }

    this.__db = join(this.__static, 'db');
    this.__company = join(this.__static, 'company');

    createIfDontExist(this.__db);
    createIfDontExist(this.__company);
  }
  /**
   * 静态文件路径 渲染进程目录下
   *
   * @type {string}
   * @memberof StaticPath
   */
  __static: string;
}
export const staticPath = new StaticPath();
/**
 * 获取真正的地址
 *
 * @param {string} devPath 开发环境路径
 * @param {string} proPath 生产环境路径
 * @param {string} [hash=""] hash值
 * @param {string} [search=""] search值
 * @return {*}  {string} 地址
 */
function getUrl(devPath: string, proPath: string, hash: string = '', search: string = ''): string {
  console.log(process.env.PORT, 'process.env.PORT');
  const url = isDev ? new URL(`http://localhost:${8080 || process.env.PORT}`) : new URL('file://');
  url.pathname = isDev ? devPath : proPath;
  url.hash = hash;
  url.search = search;
  return url.href;
}

export const staticPaths = getUrl('', staticPath.__static);
console.log('Log-- ', staticPaths, 'staticPaths');
// process.env 修改
for (const key in staticPath) {
  process.env[key] = staticPath[key];
}
