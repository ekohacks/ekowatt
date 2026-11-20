import { describe, expect, it } from 'vitest';
import { mergeOutages } from './starter.ts';

describe('mergeOutages', () => {
  it('merges overlapping and touching ranges', () => {
    expect(
      mergeOutages([
        [5, 8],
        [1, 3],
        [2, 4],
        [8, 9],
      ]),
    ).toEqual([
      [1, 4],
      [5, 9],
    ]);
  });

  it('keeps a range inside another as one', () => {
    expect(
      mergeOutages([
        [1, 10],
        [2, 3],
      ]),
    ).toEqual([[1, 10]]);
  });

  it('returns nothing for nothing', () => {
    expect(mergeOutages([])).toEqual([]);
  });
});
