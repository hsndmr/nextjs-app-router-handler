import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  title: string;

  @MaxLength(30)
  @IsNotEmpty()
  category: string;
}
