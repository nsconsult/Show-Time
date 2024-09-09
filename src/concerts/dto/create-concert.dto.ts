export class CreateConcertDto {
  readonly name: string;
  readonly date: Date;
  readonly picture: string;
  readonly genre: string;
  readonly location: string;
  readonly description: string;
  readonly price: number;
}
