import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ContactRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    username: string;
}