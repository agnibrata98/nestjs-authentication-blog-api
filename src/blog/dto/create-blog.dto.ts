import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateBlogDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
