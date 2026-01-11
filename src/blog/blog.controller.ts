import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';

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
    @UseGuards(AuthGuard('jwt'))
    @Post()
    createBlog(
        @Body() createBlogDto: CreateBlogDto,
        @Req() req,
    ) {
        return this.blogService.createBlog(
            createBlogDto,
            req.user.userId,
        );
    }

    // Protected - Update blog (only owner)
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    updateBlog(
        @Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto,
        @Req() req,
    ) {
        return this.blogService.updateBlog(
            id,
            updateBlogDto,
            req.user.userId,
        );
    }

    // Protected - Delete blog (only owner)
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deleteBlog(
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.blogService.deleteBlog(
            id,
            req.user.userId,
        );
    }
}
