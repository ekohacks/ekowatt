// Decision 13: rules a tool can check are lint rules. These tests prove each rule fires, by linting
// a small snippet that breaks it. The snippets are never written to disk.
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// The project's own config, with the snippets' made up paths let into the type checker.
const eslint = new ESLint({
  overrideConfig: {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['src/*.ts', 'tests/*.ts', 'tests/infrastructure/*.ts'],
        },
      },
    },
  },
});

const lint = async (filePath: string, code: string) => {
  const results = await eslint.lintText(code, { filePath });
  const messages = results
    .flatMap((r) => r.messages)
    .map(({ ruleId, message, fatal }) => ({
      ruleId,
      message,
      fatal,
    }));
  // A snippet that does not parse reports no rule at all, so a "lets" test would pass for the wrong reason.
  expect(messages.filter((m) => m.fatal)).toEqual([]);
  return messages;
};

describe('no mocks (decision 2)', () => {
  it('fails a test that uses vi.fn, vi.spyOn or vi.mock', async () => {
    const messages = await lint(
      'tests/mocking.test.ts',
      [
        "import { it, vi } from 'vitest';",
        "vi.mock('../src/readings.ts');",
        "it('mocks', () => { vi.fn(); vi.spyOn(console, 'log'); });",
      ].join('\n'),
    );

    const noMocks = messages.filter((m) => m.ruleId === 'no-restricted-syntax');
    expect(noMocks).toHaveLength(3);
    expect(noMocks[0]?.message).toContain('Use a Nullable');
  });
});

describe('A-Frame: logic never imports infrastructure (decision 2)', () => {
  it('fails logic that imports a wrapper', async () => {
    const messages = await lint(
      'src/pricing.ts',
      "import { Clock } from './infrastructure/clock.ts';\nexport const clock = Clock;\n",
    );

    expect(messages).toContainEqual(
      expect.objectContaining({
        ruleId: 'no-restricted-imports',
        message: expect.stringContaining('Logic never imports infrastructure') as unknown,
      }),
    );
  });

  it('lets a test import a wrapper', async () => {
    const messages = await lint(
      'tests/infrastructure/clock.test.ts',
      "import { Clock } from '../../src/infrastructure/clock.ts';\nexport const clock = Clock;\n",
    );

    expect(messages.map((m) => m.ruleId)).not.toContain('no-restricted-imports');
  });
});
