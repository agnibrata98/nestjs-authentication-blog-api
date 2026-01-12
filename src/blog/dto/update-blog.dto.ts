import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateBlogDto {

    @ApiPropertyOptional({
        example: 'Updated blog title',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        example: 'Updated blog description',
    })
    @IsOptional()
    @IsString()
    description?: string;
}
