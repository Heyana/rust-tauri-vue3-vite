import JSZip from 'jszip';

export const toZip = (files: File[]): Promise<ArrayBuffer> => {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file);
  });
  return zip.generateAsync({ type: 'arraybuffer' });
};
