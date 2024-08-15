let oskPromise: undefined | Promise<unknown> = undefined;
export const openOsk = async () => {
  if (oskPromise) return;
  const res = window.preload.exec('tasklist | findstr "osk.exe"');
  oskPromise = res;
  res.then((result) => {
    console.log('Log-- ', result, 'result');

    if (!result) {
      window.preload.exec('osk.exe');
    }
    oskPromise = undefined;
  });
};
