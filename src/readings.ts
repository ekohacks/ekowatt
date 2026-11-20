export interface Reading {
  readonly meterId: string;
  readonly intervalStart: string;
  readonly wh: number;
}

export class MeterReadings {
  static empty(): MeterReadings {
    return new MeterReadings();
  }

  record(_reading: Reading): MeterReadings {
    return MeterReadings.empty();
  }

  get(_meterId: string, _intervalStart: string): Reading | undefined {
    return undefined;
  }

  all(): readonly Reading[] {
    return [];
  }
}
