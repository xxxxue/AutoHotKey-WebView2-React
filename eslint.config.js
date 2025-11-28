import antfu, { combine, GLOB_SRC } from "@antfu/eslint-config";

const antfuConfig = antfu({
  formatters: true,
  react: true,
  typescript: {
    overrides: {
      "ts/no-unsafe-function-type": "off",
    },
  },
  // 默认会检查是否在编辑器中,忽略一些影响编码的自动修复
  // 设置 false, 配合 settings.json 中的 "fixable": true, 就可以自动修复所有规则,
  // 比如 let 转 const, 移除未使用的导入与变量 等, 但影响编码,不建议关闭
  // isInEditor: false,
}, {
  files: [
    GLOB_SRC,
  ],
  // 这里是整体禁用,
  // 仅关闭 vscode 提示, 到 settings.json 中修改
  rules: {
    "style/semi": ["error", "always"], // 末尾分号 (与 prettier 保持一致)
    "style/quotes": ["error", "double"], // 双引号 (与 prettier 保持一致)

    "react-dom/no-missing-button-type": "off",
    "react/no-array-index-key": "off",
    "style/no-multiple-empty-lines": ["error", { max: 1 }], // 最多一个空行

    "ts/ban-ts-comment": "off",
    "ts/no-use-before-define": "off",

    "eslint-comments/no-unlimited-disable": "off",

    "eqeqeq": "off",
    "no-alert": "off",
    "no-console": "off",
    "unused-imports/no-unused-vars": "off",
  },
});
export default combine(antfuConfig);
