import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * Allowed MIME types for UniConnect Social Feed uploads
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
];

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB total cap
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;  // 5MB image cap

/**
 * Multer disk storage and file filter configuration for post media
 */
export const postMediaMulterOptions = {
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          `Unsupported file format: ${file.mimetype}. Allowed MIME types: ${ALLOWED_MIME_TYPES.join(', ')}`,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (_req, _file, callback) => {
      const uploadPath = './uploads/posts';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      callback(null, uploadPath);
    },
    filename: (_req, file, callback) => {
      const ext = extname(file.originalname).toLowerCase();
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      callback(null, uniqueFilename);
    },
  }),
};

// Alias for convenience
export const multerOptions = postMediaMulterOptions;

