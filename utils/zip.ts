import JSZip from 'jszip';

export const toZip = (files: { name: string; data: ArrayBuffer | string | Buffer }[]): JSZip => {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file.data);
  });
  return zip;
};
