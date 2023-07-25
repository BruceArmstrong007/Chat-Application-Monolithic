import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  username

  @IsString()
  @IsNotEmpty()
  password: string;
}