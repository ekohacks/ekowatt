import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  tseslint.configs.stylistic,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      curly: ['error', 'all'],
      // Decision 13: the no mocks rule (decision 2) is checked here, not only stated in AGENTS.md.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.name='vi'][property.name=/^(mock|doMock|fn|spyOn|stubGlobal)$/]",
          message:
            "No mocks, spies or stubs (decision 2). Use a Nullable: the wrapper's createNull() with Configurable Responses, and check its Output Tracking.",
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  globalIgnores(['node_modules/', 'coverage/', '*.mjs']),
);
