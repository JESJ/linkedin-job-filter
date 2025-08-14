// eslint.config.js — ESLint v9 flat config (ESM)
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  // ignore junk
  {
    ignores: ['node_modules/**', 'dist/**', 'dist-*//**', '*.zip'],
  },

  // base recommended
  js.configs.recommended,

  // shared rules/plugins for all JS files
  {
    files: ['**/*.js'],
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': { node: { extensions: ['.js'] } },
    },
    rules: {
      eqeqeq: ['error', 'smart'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-constant-binary-expression': 'error',
      'no-console': 'off',
      // your code has empty catch blocks — allow them
      'no-empty': ['error', { allowEmptyCatch: true }],
      'import/no-unresolved': ['error', { ignore: ['^chrome-extension://', '^resource://'] }],
    },
  },

  // Classic scripts (no top-level import/export)
  {
    files: ['content.js', 'background.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.worker, // for service worker style globals
        chrome: 'readonly',
        browser: 'readonly',
      },
    },
  },

  // ES modules (use import/export)
  {
    files: [
      'config.js',
      'options.js',
      'dom/**/*.js',
      'filters/**/*.js',
      'ui/**/*.js',
      'utils/**/*.js',
      'storage/**/*.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        chrome: 'readonly',
        browser: 'readonly',
      },
    },
  },

  // Node scripts (if you add *.mjs)
  {
    files: ['scripts/**/*.mjs', '*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
