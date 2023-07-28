import { IsNotEmpty, IsString } from 'class-validator';

export class SearchUserRequest {
  @IsString()
  @IsNotEmpty()
  search

}