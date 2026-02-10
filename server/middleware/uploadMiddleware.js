import multer from "multer";
import multerS3 from "multer-s3";
import s3Client from "../utils/s3Config.js";
import path from "path";

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_S3_BUCKET || "pdf-storage-prime",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const type = req.body.nominationType || "education";
            const fileName = `${Date.now()}_${path.basename(file.originalname)}`;
            const fullPath = `${type}/${fileName}`;
            cb(null, fullPath);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type, only PDF is allowed!"), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

export default upload;
