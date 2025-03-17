import { Request, Response, NextFunction } from "express";
import multer from "multer";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = process.env.IMAGE_UPLOAD_DIR || "uploads"; // Default to "uploads"
        console.log("uploadPath", uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Determine file extension based on MIME type
        let fileExtension = "";
        if (file.mimetype === "image/png") {
            fileExtension = "png";
        } else if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            fileExtension = "jpg";
        } else {
            return cb(new ImageFormatError("Unsupported image type"), ""); // Reject unsupported types
        }

        // Generate a unique filename
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;

        console.log("filename", fileName);
        cb(null, fileName); // Pass the generated filename to Multer
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Pass other errors to next middleware
}