import { getFileExtension } from '../str';
import { TypeImage } from './image';

export const constImage = {
  format: [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'webp',
    'heic',
    'heif'
    // 你可以添加更多图片MIME类型
  ] as const,
  isImagePath(src: string) {
    return constImage.format.includes(getFileExtension(src.toLocaleLowerCase()) as any);
  },
  getFormat(src: string): TypeImage['format'] {
    return getFileExtension(src.toLocaleLowerCase()) as any;
  }
};
