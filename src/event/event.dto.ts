export class EventDTO {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly link: string;
  readonly isPrivate: boolean;
  readonly alert: number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly description: string;
  readonly color: string;
}
