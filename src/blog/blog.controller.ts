import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Multer } from 'multer';
import { cloudinaryStorage } from './cloudinary/cloudinary.storage';
import { BlogOwnerOrAdminGuard } from './guards/blog-owner-or-admin.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    // Public - Get all blogs
    @Get()
    @ApiOperation({ summary: 'Get all blogs' })
    @ApiResponse({ status: 200, description: 'List of all blogs' })
    getAllBlogs() {
        return this.blogService.getAllBlogs();
    }

    // Public - Get single blog
    @Get(':id')
    @ApiOperation({ summary: 'Get blog by ID' })
    @ApiResponse({ status: 200, description: 'Blog details' })
    @ApiResponse({ status: 404, description: 'Blog not found' })
    getBlogById(@Param('id') id: string) {
        return this.blogService.getBlogById(id);
    }

    // Protected - Create blog
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post()
    @Roles(Role.USER, Role.ADMIN)
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @ApiExtraModels(CreateBlogDto)
    @ApiOperation({ summary: 'Create a new blog (USER / ADMIN)' })
    @ApiBody({
        schema: {
            allOf: [
                { $ref: getSchemaPath(CreateBlogDto) },
                {
                    type: 'object',
                    properties: {
                        image: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            ],
        },
    })
    @UseInterceptors(
        FileInterceptor('image', {
            storage: cloudinaryStorage,
        }),
    )
    createBlog(
        @Body() createBlogDto: CreateBlogDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        return this.blogService.createBlog(
            createBlogDto,
            req.user.userId,
            file ? file?.path : undefined, // Cloudinary URL
        );
    }

    // Protected - Update blog (only owner)
    @UseGuards(AuthGuard('jwt'), RolesGuard, BlogOwnerOrAdminGuard)
    @Patch(':id')
    @Roles(Role.USER, Role.ADMIN)
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @ApiExtraModels(UpdateBlogDto)
    @ApiOperation({ summary: 'Update blog (OWNER / ADMIN)' })
    @ApiBody({
        schema: {
            allOf: [
                { $ref: getSchemaPath(UpdateBlogDto) },
                {
                    type: 'object',
                    properties: {
                        image: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            ],
        },
    })
    @UseInterceptors(
        FileInterceptor('image', {
            storage: cloudinaryStorage,
        }),
    )
    updateBlog(
        @Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        return this.blogService.updateBlog(
            id,
            updateBlogDto,
            req.user,
            file ? file?.path : undefined, // Cloudinary URL
        );
    }

    // Protected - Delete blog (only owner)
    @UseGuards(AuthGuard('jwt'), RolesGuard, BlogOwnerOrAdminGuard)
    @Delete(':id')
    @Roles(Role.USER, Role.ADMIN)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete blog (OWNER / ADMIN)' })
    @ApiResponse({ status: 200, description: 'Blog deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    deleteBlog(
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.blogService.deleteBlog(
            id,
            req.user,
        );
    }
}
