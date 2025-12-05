import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client } from "@/config/s3";
import { appConfig } from "@/config/env";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: appConfig.aws.bucketName || "",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const folder = file.fieldname === "images" ? "Hospitals" : "Users";
      cb(null, `${folder}/${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please upload only images.", StatusCodes.BAD_REQUEST) as any, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const deleteFile = async (fileUrl: string) => {
  try {
    // Extract key from URL
    // URL format: https://bucket-name.s3.region.amazonaws.com/folder/filename
    const bucketUrl = `https://${appConfig.aws.bucketName}.s3.${appConfig.aws.region}.amazonaws.com/`;
    if (!fileUrl.startsWith(bucketUrl)) {
      console.warn("File URL does not match bucket URL, skipping delete:", fileUrl);
      return;
    }

    const key = fileUrl.replace(bucketUrl, "");
    
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: appConfig.aws.bucketName,
        Key: key,
      })
    );
    console.log(`Deleted file from S3: ${key}`);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    // We don't throw here to avoid blocking the main operation if cleanup fails
  }
};

export {
  upload,
  deleteFile,
};
