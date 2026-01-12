// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// export const cloudinaryStorage = (cloudinary: any) =>
//   new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: 'blogs',
//       allowed_formats: ['jpg', 'jpeg', 'png'],
//     } as any,
//   });




import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blogs',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    } as any,
});
