import Multer from 'multer';
import path from 'node:path';

const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = Multer({ storage: storage });


// import Multer from 'multer';

// // Cek lingkungan (development atau production)
// const isProduction = process.env.NODE_ENV === 'production';

// let storage;

// if (isProduction) {
//   // Gunakan Cloudinary atau S3 untuk production
//   const { CloudinaryStorage } = require('multer-storage-cloudinary');
//   const cloudinary = require('cloudinary').v2;

//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET,
//   });

//   storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'threads', // Nama folder di Cloudinary
//       allowed_formats: ['jpg', 'png', 'jpeg'],
//     },
//   });
// } else {
//   // Gunakan diskStorage untuk pengembangan lokal
//   storage = Multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './src/tmp');
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(
//         null,
//         file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
//       );
//     },
//   });
// }

// export const upload = Multer({ storage });
