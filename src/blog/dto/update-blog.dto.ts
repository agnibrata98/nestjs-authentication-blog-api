import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateBlogDto {

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
