import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../schema/blog.schema';

@Injectable()
export class BlogOwnerOrAdminGuard implements CanActivate {
    constructor(
        @InjectModel(Blog.name)
        private readonly blogModel: Model<Blog>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const blogId = req.params.id;
        const user = req.user;

        if (!blogId) {
            throw new ForbiddenException('Blog id is required');
        }

        const blog = await this.blogModel.findById(blogId);

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        const isOwner = blog.authorId.toString() === user.userId;
        const isAdmin = user.role === 'admin';

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException(
                'You are not allowed to modify this blog',
            );
        }

        return true; // allow request to continue
    }
}
