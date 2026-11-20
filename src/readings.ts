export interface Reading {
  readonly meterId: string;
  readonly intervalStart: string;
  readonly wh: number;
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
    const copy = new Map(this.readings);
    copy.set(this.keyOf(reading.meterId, reading.intervalStart), reading);
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
