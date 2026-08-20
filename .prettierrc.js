// @ts-check

/** @type {import("prettier").Config} */
export default {
  // 箭头函数单个参数也需要括号
  arrowParens: "always",
  // 开始标签的右尖括号是否跟随在最后一行属性末尾
  bracketSameLine: false,
  // 对象字面量的括号之间打印空格
  bracketSpacing: true,
  // 是否格式化文件中被嵌入的代码片段
  embeddedLanguageFormatting: "auto",
  // HTML 文件的空格敏感度
  htmlWhitespaceSensitivity: "ignore",
  // 是否在文件顶部插入 @format 标记
  insertPragma: false,
  // JSX 中使用单引号
  jsxSingleQuote: false,
  // 每行最多字符数量
  printWidth: 120,
  // 超出打印宽度
  proseWrap: "preserve",
  // 对象属性是否使用引号
  quoteProps: "as-needed",
  // 是否只格式化包含特定注释的文件
  requirePragma: false,
  // 阿里规范：必须使用分号
  semi: true,
  // 阿里规范：使用单引号
  singleQuote: true,
  // 缩进空格数
  tabWidth: 2,
  // 阿里规范：在 ES5 有效的尾随逗号（对象、数组等）
  trailingComma: "es5",
  // 指定缩进方式
  useTabs: false,
  // vue 文件中是否缩进 <style> 和 <script> 标签
  vueIndentScriptAndStyle: false
};
