import sharp from 'sharp';
import { constImage } from './const.image';
import { promises } from 'dns';
import { readFile } from 'fs/promises';
const convert = require('heic-convert');
console.log('Log-- ', convert, 'convert');
export type TypeImage = {
  format: (typeof constImage)['format'][number];
  options?: {
    quality?: number;
  };
};
export abstract class ImageParser {
  type: TypeImage['format'];
  constructor(type: TypeImage['format']) {
    this.type = type;
  }

  abstract toBuffer(src: string, options?: TypeImage['options']): Promise<Buffer | undefined>;
  convertToBuffer?(src: string, options?: TypeImage['options']): Promise<Buffer | undefined>;
  convertToBufferFromBuffer?(
    buffer: Buffer,
    options?: TypeImage['options']
  ): Promise<Buffer | undefined>;
}
const image = new (class {
  constructor() {}
  convert(src: string, dest: string, format: string): boolean {
    if (!this.valid(src)) {
      return false;
    }
    return true;
  }
  valid(src: string) {
    if (!constImage.isImagePath(src)) {
      return false;
    }
    return true;
  }
  async convertToBuffer(
    src: string,
    format: TypeImage['format'],
    options?: TypeImage['options']
  ): Promise<Buffer | undefined> {
    if (!this.valid(src)) {
      return Promise.resolve(undefined);
    }

    const srcFormat = constImage.getFormat(src);
    const srcParser = this.options.get(srcFormat);
    console.log('Log-- ', srcParser, 'srcParser');
    const parser = this.options.get(format);
    console.log('Log-- ', parser, 'parser');

    const buffer = await srcParser?.toBuffer(src, options);
    if (!buffer) {
      return Promise.resolve(undefined);
    }

    console.log('Log-- ', parser, format, 'parser,format');
    try {
      if (parser) return parser.convertToBufferFromBuffer?.(buffer, options);
    } catch (e) {
      console.log('Log--Err ', e, 'e');
    }
    return Promise.resolve(undefined);
  }
  options = new Map<TypeImage['format'], ImageParser>();
})();
const bindType = [
  () => {
    class SharpParser extends ImageParser {
      toBuffer(src: string | Buffer, options?: TypeImage['options']): Promise<Buffer | undefined> {
        switch (this.type) {
          case 'png': {
            return sharp(src).png(options).toBuffer();
          }
          case 'gif': {
            return sharp(src).gif().toBuffer();
          }
          case 'jpeg':
          case 'jpg': {
            return sharp(src).jpeg(options).toBuffer();
          }

          case 'webp': {
            return sharp(src).webp(options).toBuffer();
          }
        }
        return Promise.resolve(undefined);
      }
      convertToBuffer(src: string, options?: TypeImage['options']): Promise<Buffer | undefined> {
        return this.toBuffer(src, options);
      }
      convertToBufferFromBuffer(
        buffer: Buffer,
        options?: TypeImage['options']
      ): Promise<Buffer | undefined> {
        return this.toBuffer(buffer, options);
      }
    }
    image.options.set('png', new SharpParser('png'));
    image.options.set('jpeg', new SharpParser('jpeg'));
    image.options.set('jpg', new SharpParser('jpg'));
    image.options.set('gif', new SharpParser('gif'));
    image.options.set('webp', new SharpParser('webp'));
  },
  () => {
    class SharpParser extends ImageParser {
      async toBuffer(
        src: string | Buffer,
        options?: TypeImage['options']
      ): Promise<Buffer | undefined> {
        const buffer = src instanceof Buffer ? src : await readFile(src);
        console.log('Log-- ', buffer, 'buffer');
        switch (this.type) {
          case 'heic':
          case 'heif': {
            return convert({
              buffer: buffer,
              format: 'JPEG', // output format
              quality: options?.quality !== undefined ? options.quality / 100 : 1 // output quality
            });
          }
        }
        return Promise.resolve(undefined);
      }
    }
    image.options.set('heic', new SharpParser('heic'));
    image.options.set('heif', new SharpParser('heif'));
  }
];
bindType.map((fn) => fn());
export { image as utilsImage };
