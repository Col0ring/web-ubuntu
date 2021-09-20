const prettierConfig = require('./prettier.config')
module.exports = {
  extends: [
    'stylelint-config-standard',
    // 用于排序
    'stylelint-config-rational-order',
    'stylelint-prettier/recommended',
  ],
  plugins: [
    'stylelint-order',
    // 用于提示我们写的矛盾样式
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-less',
  ],
  rules: {
    'prettier/prettier': [true, prettierConfig],
    'plugin/declaration-block-no-ignored-properties': true,
    'comment-empty-line-before': null,
    'declaration-empty-line-before': null,
    'function-name-case': 'lower',
    'no-descending-specificity': null,
    'no-invalid-double-slash-comments': null,
    'rule-empty-line-before': ['always', { except: ['first-nested'] }],
    // less
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    // tailwind
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
  },
  // stylelint 支持直接配置忽略文件
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
    'dist-ssr/**/*',
    'src/**/*.{tsx,ts,jsx,js}',
  ],
}
