import { IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category: string;
}
