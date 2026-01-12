import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateBlogDto {

    @ApiProperty({
        example: 'Understanding NestJS Guards',
        description: 'Title of the blog post',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        example: 'This blog explains how guards work in NestJS...',
        description: 'Blog description/content',
    })
    @IsNotEmpty()
    @IsString()
    description: string;
}
