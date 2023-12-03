import { IsString, IsNotEmpty, Length } from 'class-validator';

export class GroupDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  name: string;

  @IsString()
  topic: string;
}
