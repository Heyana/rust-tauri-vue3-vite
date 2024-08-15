export const toNumber = (value: any): number | undefined => {
  const num = Number(value);
  if (!isNaN(num)) {
    return num;
  }
  return undefined;
};
