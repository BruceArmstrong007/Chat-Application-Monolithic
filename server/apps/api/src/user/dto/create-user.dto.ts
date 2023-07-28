import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username

  @IsString()
  @IsNotEmpty()
  password: string;
}