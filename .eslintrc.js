const prettierConfig = require('./prettier.config')
const __DEV__ = process.env.NODE_ENV !== 'production'

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    // ts 支持
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    // plugin:prettier/recommended 需要为最后一个扩展
    'plugin:prettier/recommended',
  ],
  // rules 可根据条件自行配置
  rules: {
    // prettier
    'prettier/prettier': ['warn', prettierConfig],
    // js
    'import/default': 'off',
    'no-shadow': 'error',
    'no-unused-vars': 'warn',
    'no-debugger': __DEV__ ? 'off' : 'warn', // 调试
    'no-console': __DEV__ ? 'off' : 'warn', // 日志打印
    'require-yield': 'warn', // 不允许 generate 函数中没有 yield
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    // react
    'react/self-closing-comp': 'error',
    // display name
    'react/display-name': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    // click element muse have keyboard events
    'jsx-a11y/click-events-have-key-events': 'off',
    // click element must have a role property
    'jsx-a11y/no-static-element-interactions': 'off',
    // comments
    'eslint-comments/disable-enable-pair': [
      'warn',
      {
        allowWholeFile: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  // ts 规则单独覆盖
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      // 只针对 ts 用 typescript-eslint
      parser: '@typescript-eslint/parser',
      // 开启静态检查
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        // close js rules
        'no-shadow': 'off',
        // ts
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        // no any
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        // ! operator
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
}
