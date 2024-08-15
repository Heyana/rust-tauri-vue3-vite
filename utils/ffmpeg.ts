import fluentFfmpeg from 'fluent-ffmpeg-fork';
import fs, { writeFileSync } from 'fs';
import { join } from 'path';
import { getFilenameWithoutExtension } from './fs';
import _ from 'lodash';
import { exec } from 'sudo-prompt';
import { getImageMetadata } from './sharp';
import { execFile } from 'node:child_process';
const ffmpegPathStatic = require('ffmpeg-static-electron-fork');
const ffprobePath = require('ffprobe-static-electron');

const ffmpeg: typeof import('fluent-ffmpeg') = fluentFfmpeg;
fluentFfmpeg.setFfmpegPath(ffmpegPathStatic.path);
fluentFfmpeg.setFfprobePath(ffprobePath.path);
console.log('Log-- ', ffmpegPathStatic.path, 'ffmpegPath.path');
const ffmpegPath = ffmpegPathStatic.path;
export { ffmpeg, ffmpegPath };

// 均匀截图九张
export const captureNineScreenshots = async (
  videoPath: string,
  outputDir: string,
  scale = 1,
  info: fluentFfmpeg.FfprobeStream
): Promise<(string | undefined)[]> => {
  const step = 1 / 9;
  if (!info.width || !info.height) return Promise.resolve([]);
  let width = info.width;
  let height = info.height;

  if (info.width > 512) {
    width = info.width * scale;
    height = info.height * scale;
  }

  const promises = new Array(9).fill(0).map((_, idx) => {
    const now = step * 90 * (idx + 1);

    return new Promise<string | undefined>(async (resolve) => {
      const fileName = getFilenameWithoutExtension(videoPath).replace(/[%&#]/g, '_');
      const outName = `${fileName}_${now}.webp`;
      const path = join(outputDir, outName);

      if (fs.existsSync(path)) {
        resolve(path);
      } else {
        fluentFfmpeg(videoPath)
          .screenshots({
            timemarks: [now + '%'],
            folder: outputDir,
            filename: outName,
            size: `${Math.ceil(width)}x${Math.ceil(height)}`
          })
          .on('end', () => {
            resolve(path);
          })
          .on('error', (err) => {
            resolve(undefined);
          });
      }
    });
  });

  return Promise.all(promises);
};

export const getVideoInfo = async (
  videoPath: string
): Promise<fluentFfmpeg.FfprobeStream | undefined> => {
  return new Promise((resolve, reject) => {
    fluentFfmpeg.ffprobe(videoPath, (err, metadata) => {
      const videoStream = metadata?.streams.find((stream) => stream.codec_type === 'video');
      if (err) {
        resolve(undefined);
      } else {
        resolve(videoStream);
      }
    });
  });
};

export const convertImagesToWebm = (map: {
  images: string[];
  tempFloder: string;
  outPath: string;
  fps: number | undefined;
  resolution: number | undefined;
}): Promise<boolean> => {
  const { images, tempFloder, fps, resolution, outPath } = map;
  let text = '';
  const last = _.last(images);

  return new Promise(async (resolve) => {
    const size = await getImageMetadata(images[0]);
    if (!size || !last) {
      return resolve(false);
    }
    const { width, height } = size;

    images.forEach((i) => {
      text += `file '${i}'\nduration ${(_.isNumber(fps) ? fps : 25) / 1000}\n`;
    });

    text += `file '${last}'`;

    if (!text || !width || !height) {
      return resolve(false);
    }

    const textPath = join(tempFloder, 'out.txt');
    writeFileSync(textPath, text);

    let tResolution = 1;
    if (resolution) {
      const numResolution = _.toNumber(resolution);
      if (_.isNumber(numResolution) && numResolution > 0 && numResolution <= 1) {
        tResolution = numResolution;
      }
    }

    const execStr = `${ffmpegPath} -f concat -safe 0 -i ${textPath} -vf "scale=${
      width * tResolution
    }:${height * tResolution}" -r ${
      _.isNumber(fps) ? fps : 25
    } -b:v 100M -c:v libvpx -pix_fmt yuva420p -auto-alt-ref 0 "${outPath}"`;

    exec(`${execStr}`, (error, stdout, stderr) => {
      if (error) {
        const info = [ffmpegPath, error, stdout, stderr].join(';next:');
        writeFileSync(join(tempFloder, 'error.txt'), JSON.stringify(info));

        console.error(`exec error: ${error}`);
        return resolve(false);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      return resolve(true);
    });
  });
};

export const convertVideoToHls = (map: { path: string; outPath: string }) => {
  const { path, outPath } = map;
  return new Promise<boolean>((s) => {
    const out = outPath + '/playlist.m3u8';
    ffmpeg(path)
      .outputFormat('hls') // 设置输出视频格式为HLS
      .outputOptions(['-hls_list_size 0', '-hls_time 5']) // 设置播放列表大小和每段视频的时长
      .output(out) // 输出M3U8播放列表文件
      .on('start', function () {
        console.log('Start processing');
      })
      .on('error', function (err) {
        console.error('An error occurred: ' + err.message);
        s(false);
      })
      .on('end', function () {
        console.log('Processing finished');
        s(out as any);
      })
      .run(); // 开始转换过程
  });
};

interface ConversionOptions {
  inputPath: string;
  outputPath: string;
  rate?: number; // 视频比特率
  onProgress?: (progress: { percent: number; time: number }) => void;
}

export function convertVideoUseAmdGpuAccelerate(options: ConversionOptions) {
  const { inputPath, outputPath, rate = 10000, onProgress } = options;

  // 确保输入文件存在
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file does not exist: ${inputPath}`);
  }
  console.log('Log-- ', ffmpegPathStatic, 'ffmpegPathStatic');

  // 准备FFmpeg命令及其参数
  const ffmpegCommand = ffmpegPathStatic.path;
  const ffmpegArgs = [
    '-hwaccel',
    'd3d11va',
    // 'opencl',
    '-i',
    `"${inputPath}"`,
    '-c:v',
    // 'libsvtav1',
    'av1_amf ',
    // 'hevc_amf',
    // 'libvpx-vp9',
    '-preset',
    'veryfast',
    '-b:v',
    `${rate}k`,
    '-bufsize',
    `${Number(rate) * 2 * 2}k`,
    '-rc:v',
    'cbr',
    '-vbaq',
    'true',
    // '-vf',
    // `scale=trunc(iw/2)*2:trunc(ih/2)*2`,
    '-c:a',
    'copy',
    '-threads',
    '16',
    `"${outputPath}"`
  ];

  return new Promise<void>((resolve, reject) => {
    console.log('Log-- ', ffmpegArgs, 'ffmpegArgs');
    // 执行FFmpeg命令
    const ffmpegProcess = execFile(
      ffmpegCommand,
      ffmpegArgs,
      { shell: true },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`FFmpeg execution failed with error: ${error},--${inputPath}`);
          reject(error);
        } else {
          console.log('FFmpeg execution completed successfully');
          resolve();
        }
      }
    );

    // 监听子进程的错误输出
    ffmpegProcess.stderr?.on('data', (data) => {
      console.log(`FFmpeg error output: ${data}`);
    });
  });
}
