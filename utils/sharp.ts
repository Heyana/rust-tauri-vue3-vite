import { existsSync } from 'fs';
import { basename, extname } from 'path';
import sharp, { WebpOptions } from 'sharp';
import { readGif } from 'sharp-gif2';
import { utilsImage } from './image/image';
import { arrEx } from './js';

export async function createImageNinePatch(
  imagePaths: string[],
  outputPath: string,
  sizeScale: number
) {
  return new Promise<undefined | string>(async (s) => {
    let metadata: sharp.Metadata | undefined;
    try {
      metadata = await sharp(imagePaths[0]).metadata();
    } catch (error) {
      console.log('Log-- ', error, 'error');
      s(undefined);
      return;
    }
    const imageWidth = metadata.width;
    const imageHeight = metadata.height;
    const tWidth = Math.ceil((imageWidth || 1920) * sizeScale);
    const tHeight = Math.ceil((imageHeight || 1080) * sizeScale);
    try {
      sharp({
        create: {
          width: tWidth * 3, // 画板宽度
          height: tHeight * 3, // 画板高度
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // 画板背景色
        }
      })
        .composite(
          arrEx.filter(
            imagePaths.map((i, idx) => {
              const base = Math.floor(idx / 3);
              const index = (idx + 1) % 3 || 3;
              const left = (index - 1) * tWidth;
              const top = base * tHeight;
              if (!existsSync(i)) {
                console.log('Log-- ', i, 'i789');
                return;
              }
              return {
                input: i,
                left,
                top
              };
            })
          ) as any
        )
        .toFormat('webp')
        .toFile(outputPath)
        .then(() => {
          s(outputPath);
        })
        .catch((e) => {
          console.log(e, 'e');
          s(undefined);
        });
    } catch (e) {
      console.log(e, 'e');
      s(undefined);
    }
  });
}

export const getImageMetadata = (path: string) => {
  return sharp(path).metadata();
};

export const getImageGifMetadata = (path: string | Buffer) => {
  return readGif(sharp(path, { animated: true }) as any);
};

export const toWebpFromBuffer = (buffer: Buffer, options?: WebpOptions) => {
  return sharp(buffer).webp(options).toBuffer();
};

interface CompressedImage {
  name: string;
  buffer: Buffer;
}

export async function compressAndConvert(
  imagePaths: {
    path: string;
    name: string;
  }[],
  quality: number
): Promise<CompressedImage[]> {
  const compressedImages: CompressedImage[] = [];

  for (const image of imagePaths) {
    const { path: imagePath, name } = image;
    const originalExtension = extname(imagePath).slice(1) as any;

    try {
      // 使用sharp压缩为webp
      const webpBuffer = await sharp(imagePath).webp({ quality }).toBuffer();

      // 将webp转换回原始格式或指定格式
      const convertedBuffer = await sharp(webpBuffer).toFormat(originalExtension).toBuffer();

      // 将结果添加到数组中
      compressedImages.push({
        name: basename(name) + '',
        buffer: convertedBuffer
      });
    } catch (error) {
      console.error(`Error processing file ${imagePath}:`, error);
    }
  }

  return compressedImages;
}

export async function convertToWebp(
  imagePaths: {
    path: string;
    name: string;
  }[],
  quality: number
): Promise<CompressedImage[]> {
  const compressedImages: CompressedImage[] = [];

  for (const image of imagePaths) {
    const { path: imagePath, name } = image;

    try {
      // 使用sharp压缩为webp
      const webpBuffer = await utilsImage.convertToBuffer(imagePath, 'webp', { quality });
      if (webpBuffer) {
        compressedImages.push({
          name: basename(name),
          buffer: webpBuffer
        });
      }
      // 将结果添加到数组中
    } catch (error) {
      console.error(`Error processing file ${imagePath}:`, error);
    }
  }

  return compressedImages;
}
