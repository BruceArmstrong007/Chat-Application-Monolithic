import { Fields } from '@app/common';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ContactRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  username: string;
}

export class SeenRequest {
  @IsString()
  @IsNotEmpty()
  @IsEnum(Fields)
  reference: Fields;
}
