// const GLTF = require("gltf-pipeline-fork");

import { processGlb } from 'gltf-pipeline-fork';
const baseOptions = {
  resourceDirectory: '.',
  separate: false,
  separateTextures: false,
  stats: false,
  keepUnusedElements: false,
  name: 'model-processed',
  dracoOptions: {
    compressMeshes: true,
    'compress-meshes': true,
    quantizePositionBits: 18,
    'quantize-position-bits': 18,
    quantizeTexcoordBits: 20,
    'quantize-texcoord-bits': 20,
    compressionLevel: 7,
    'compression-level': 7,
    quantizeNormalBits: 8,
    'quantize-normal-bits': 8,
    quantizeColorBits: 8,
    'quantize-color-bits': 8,
    quantizeGenericBits: 8,
    'quantize-generic-bits': 8,
    uncompressedFallback: false,
    'uncompressed-fallback': false,
    unifiedQuantization: false,
    'unified-quantization': false
  }
};
export const compressGlb = async (buffer: ArrayBuffer) => {
  console.log(buffer, 'buffer');
  try {
    const ab = await processGlb(buffer, baseOptions);
    return ab;
  } catch (e) {
    console.log(e, 'e');
  }
  return null;
};
