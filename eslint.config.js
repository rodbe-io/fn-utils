import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { jsRules, tsRules } from '@rodbe/eslint-config';
import eslint from '@eslint/js';
import json from '@eslint/json';
import tsEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import packageJsonPlugin from 'eslint-plugin-package-json';

const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line no-restricted-exports
export default tsEslint.config(
  { ignores: ['**/dist/', '**/docs/', '**/coverage/', '**/*.d.ts', 'node_modules'] },
  {
    extends: [json.configs.recommended],
    files: ['**/*.json'],
    ignores: ['**/package.json', '**/package-lock.json'],
    language: 'json/json',
    rules: {
      'json/sort-keys': 'error',
    },
  },
  {
    extends: [json.configs.recommended],
    files: ['**/*.jsonc'],
    language: 'json/jsonc',
    rules: {
      'json/sort-keys': 'error',
    },
  },
  {
    extends: [json.configs.recommended],
    files: ['**/*.json5'],
    language: 'json/json5',
    rules: {
      'json/sort-keys': 'error',
    },
  },
  {
    extends: [
      eslint.configs.recommended,
      tsEslint.configs.strictTypeChecked,
      tsEslint.configs.stylisticTypeChecked,
      jsRules,
      tsRules,
    ],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
        },
        tsconfigRootDir: __dirname,
      },
    },
  },
  packageJsonPlugin.configs.recommended,
  prettier
);
