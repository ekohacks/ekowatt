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

  it('leaves the reports it was given unchanged', () => {
    // Copying the list is not enough: the ranges inside it are the caller's own. An answer that
    // grows a range in place passes the other tests and quietly rewrites the reports.
    const reports: [number, number][] = [
      [5, 8],
      [1, 3],
      [2, 4],
      [8, 9],
    ];
    const before = reports.map((r) => [...r]);

    mergeOutages(reports);

    expect(reports).toEqual(before);
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
