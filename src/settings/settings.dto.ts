export class SettingsDto {
  readonly id: string;
  readonly startHour: number;
  readonly endHour: number;
  readonly lastLaborDay: number;
  readonly enableGrid: boolean;
  readonly userId: string;
}
