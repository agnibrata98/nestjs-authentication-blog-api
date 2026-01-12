import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the user',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'john@example.com',
        description: 'User email address',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'Password (minimum 6 characters)',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}