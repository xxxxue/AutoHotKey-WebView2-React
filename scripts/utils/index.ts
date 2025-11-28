import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
/**
 * 获取目录中所有的文件路径
 * @param dir_path 文件夹路径
 */
export function getFilesPath(dir_path: string): string[] {
  function readFile(path: string, filesList: string[]) {
    const files = readdirSync(path);
    files.forEach(walk);
    function walk(file: string) {
      const states = statSync(`${path}/${file}`);
      if (states.isDirectory()) {
        readFile(join(path, file), filesList);
      }
      else {
        filesList.push(join(path, file));
      }
    }
  }
  const file_list = [];
  readFile(dir_path, file_list);
  return file_list;
}

export function splitOnFirstSpace(str) {
  // 找到第一个空格的位置
  const firstSpaceIndex = str.indexOf(" ");

  if (firstSpaceIndex === -1) {
    // 如果没有空格，整个字符串作为第一部分，第二部分为空字符串
    return [str, ""];
  }
  else {
    // 截取第一部分：从开头到第一个空格之前
    const firstPart = str.slice(0, firstSpaceIndex);
    // 截取第二部分：从第一个空格之后到字符串末尾
    const secondPart = str.slice(firstSpaceIndex + 1);
    return [firstPart, secondPart];
  }
}
