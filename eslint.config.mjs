import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

// Decision 13: rules a tool can check are lint rules. Each message says what to do instead.
const noMocks = {
  selector:
    "MemberExpression[object.name='vi'][property.name=/^(mock|doMock|fn|spyOn|stubGlobal)$/]",
  message:
    "No mocks, spies or stubs (decision 2). Use a Nullable: the wrapper's createNull() with Configurable Responses, and check its Output Tracking.",
};

const fromInputs =
  'Tests take time and randomness from their inputs (decisions 10 and 12). Use a fixed ISO string or Date.UTC, a nulled Clock, or the fast-check seed.';

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
      'no-restricted-syntax': ['error', noMocks],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Decision 13: A-Frame (decision 2). Logic never imports infrastructure; only the application wires them.
    // When the application arrives, its step adds its file to `ignores` here.
    files: ['src/**/*.ts'],
    ignores: ['src/infrastructure/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure', '**/infrastructure/**'],
              message:
                'Logic never imports infrastructure (A-Frame, decision 2). Take the data as a parameter; the application reads it from the wrapper and passes it in.',
            },
          ],
        },
      ],
    },
  },
  {
    // Decisions 10 and 12: a test that reads the clock or Math.random cannot be replayed.
    // Listing no-restricted-syntax here replaces the options above, so the no mocks rule is repeated.
    files: ['tests/**/*.ts', 'katas/**/*.test.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        noMocks,
        {
          selector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
          message: fromInputs,
        },
        {
          selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message: fromInputs,
        },
        { selector: "NewExpression[callee.name='Date'][arguments.length=0]", message: fromInputs },
      ],
    },
  },
  globalIgnores(['node_modules/', 'coverage/', '*.mjs']),
);
