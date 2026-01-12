import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schema/blog.schema';
import { Model, Types } from 'mongoose';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name)
        private blogModel: Model<Blog>,
    ) { }

    // 🔹 Create Blog
    async createBlog(
        createBlogDto: CreateBlogDto,
        authorId: string,
        image?: string,
    ) {
        const blog = await this.blogModel.create({
            ...createBlogDto,
            authorId: new Types.ObjectId(authorId),
            image
        });

        return blog;
    }

    // 🔹 Get all blogs
    async getAllBlogs() {
        return this.blogModel
            .find()
            .populate('authorId', 'name email')
            .sort({ createdAt: -1 });
    }

    // 🔹 Get single blog by ID
    async getBlogById(blogId: string) {
        const blog = await this.blogModel
            .findById(blogId)
            .populate('authorId', 'name email');

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }

    // 🔹 Update blog (only owner)
    async updateBlog(
        blogId: string,
        updateBlogDto: UpdateBlogDto,
        user: { userId: string; role: string },
        image?: string,
    ) {
        const blog = await this.blogModel.findById(blogId);

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        // USER must own the blog
        // ADMIN can update any blog
        if (
            blog.authorId.toString() !== user.userId &&
            user.role !== 'admin'
        ) {
            throw new ForbiddenException(
                'You are not allowed to update this blog',
            );
        }

        Object.assign(blog, updateBlogDto);
        if (image) {
            blog.image = image;
        }
        return blog.save();
    }

    // 🔹 Delete blog (only owner)
    async deleteBlog(blogId: string, user: { userId: string; role: string }) {
        const blog = await this.blogModel.findById(blogId);

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        // USER must own
        // ADMIN can delete any
        if (
            blog.authorId.toString() !== user.userId &&
            user.role !== 'admin'
        ) {
            throw new ForbiddenException(
                'You are not allowed to delete this blog',
            );
        }

        await blog.deleteOne();
        return { message: 'Blog deleted successfully' };
    }
}
