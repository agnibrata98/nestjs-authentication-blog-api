import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema';
import { CloudinaryProvider } from 'src/blog/config/cloudinary.provider';
import { BlogOwnerOrAdminGuard } from './guards/blog-owner-or-admin.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
    ])
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogOwnerOrAdminGuard, CloudinaryProvider]
})
export class BlogModule {}
