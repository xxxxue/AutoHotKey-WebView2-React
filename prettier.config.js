// 修改后,需要重启 vscode 插件系统, 让 prettier 加载到最新的配置
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  // 格式化 Tailwindcss
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["classNames"],
};
