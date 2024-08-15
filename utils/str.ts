export const rmNumFromStr = (str: string) => {
  return str.replace(/(\d+\.?\d*)|(\.\d+)/g, '');
};

export function removeSpecialCharacters(input: string): string {
  // 匹配常见的标点符号和指定的特殊字符
  // 这里我们添加了\、.、/、, 到正则表达式中
  const specialCharRegex = /[!"#$%&'()*+,\-.\/:;<=>?@\[\]^_`{|}~\\\/,]+/g;
  const result = input.replace(specialCharRegex, '');
  return result;
}

export function getSamePrefix(strs: string[]): string {
  if (strs.length === 0) {
    return '';
  }

  // 假设第一个字符串（如果存在）是所有字符串的前缀
  let prefix = strs[0];

  // 遍历所有字符串，逐个字符比较
  for (let i = 0; i < prefix.length; i++) {
    // 遍历除第一个字符串外的所有字符串
    for (let j = 1; j < strs.length; j++) {
      // 如果当前索引的字符不匹配，则缩短前缀
      if (i >= strs[j].length || strs[j][i] !== prefix[i]) {
        prefix = prefix.slice(0, i); // 截取到不匹配的索引之前的部分
        break; // 跳出内层循环，因为后面的比较已经没有意义了
      }
    }
  }

  return prefix;
}

export function removeSubstring(str: string, remove: string): string {
  // 使用全局搜索的正则表达式（g 标志）来替换所有匹配的子字符串
  // 如果 remove 包含特殊字符，你可能需要对其进行转义
  return str.replace(new RegExp(remove, 'g'), '');
}

export function removeExtension(fileNameWithExt: string): string {
  return fileNameWithExt.replace(/\.[^/.]+$/, '');
}

export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return ''; // 如果文件名中没有点，则没有拓展名
  }
  return fileName.substring(lastDotIndex + 1);
}
