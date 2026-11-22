export interface Reading {
  readonly meterId: string;
  readonly intervalStart: string;
  readonly wh: number;
  /** A corrected reading for the same meter and half hour carries a higher revision. */
  readonly revision: number;
}

export class MeterReadings {
  static empty(): MeterReadings {
    return new MeterReadings();
  }

  private readonly readings: ReadonlyMap<string, Reading>;

  private constructor(readings: ReadonlyMap<string, Reading> = new Map()) {
    this.readings = readings;
  }

  record(reading: Reading): MeterReadings {
    const key = this.keyOf(reading.meterId, reading.intervalStart);
    const kept = this.readings.get(key);
    // Keep the max per key: a reading counts only if no higher or equal revision is already kept,
    // so a late original or a repeat changes nothing, in whatever order they arrive.
    if (kept !== undefined && kept.revision >= reading.revision) {
      return this;
    }
    const copy = new Map(this.readings);
    copy.set(key, reading);
    return new MeterReadings(copy);
  }

  get(meterId: string, intervalStart: string): Reading | undefined {
    return this.readings.get(this.keyOf(meterId, intervalStart));
  }

  all(): readonly Reading[] {
    return [...this.readings.values()];
  }

  // `|` appears in neither a meter id nor an ISO date; `-` appears in both.
  private keyOf(meterId: string, intervalStart: string): string {
    return `${meterId}|${intervalStart}`;
  }
}
