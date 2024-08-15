export function formatDurationToMostAppropriateUnit(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else if (milliseconds < 60000) {
    return `${Math.round(milliseconds / 1000)}s`;
  } else if (milliseconds < 3600000) {
    return `${Math.round(milliseconds / (1000 * 60))}m`;
  } else if (milliseconds < 86400000) {
    return `${Math.round(milliseconds / (1000 * 60 * 60))}h`;
  } else {
    return `${Math.round(milliseconds / (1000 * 60 * 60 * 24))}d`;
  }
}

export function formatDateStrToYYYYMMDD(dateStr?: string, inputDate?: Date): string {
  const date = inputDate || new Date(dateStr || '');

  const year = date
    .getFullYear()
    .toString()
    .padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth()返回的是0-11，所以要+1
  const day = date
    .getDate()
    .toString()
    .padStart(2, '0');
  return `${year}-${month}-${day}`;
}
export const addDaysToDate = (
  yymmdd: string,
  daysToAdd: number,
  isAdd = true
): Date | undefined => {
  console.log('Log-- ', yymmdd, 'yymmdd');

  const date = new Date(yymmdd);

  console.log('Log-- ', date.toLocaleString(), 'date.toLocaleString()');
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return;
  }

  // 在日期上添加或减去指定的天数
  const newDate = new Date(
    isAdd
      ? date.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      : date.getTime() - daysToAdd * 24 * 60 * 60 * 1000
  );

  return newDate;
};
export let getDate = () => {
  var time = new Date();
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return y + '-' + m + '-' + d;
};
