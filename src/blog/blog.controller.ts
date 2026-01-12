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

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    // Public - Get all blogs
    @Get()
    getAllBlogs() {
        return this.blogService.getAllBlogs();
    }

    // Public - Get single blog
    @Get(':id')
    getBlogById(@Param('id') id: string) {
        return this.blogService.getBlogById(id);
    }

    // Protected - Create blog
    @UseGuards(AuthGuard('jwt'), RolesGuard, BlogOwnerOrAdminGuard)
    @Post()
    @Roles(Role.USER, Role.ADMIN)
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
