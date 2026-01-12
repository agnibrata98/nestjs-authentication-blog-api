import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {

    @ApiProperty({
        example: 'john@example.com',
        description: 'Registered email address',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'User password',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;


}