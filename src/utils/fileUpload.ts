import AWS from "aws-sdk";
import { Request } from "express";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

interface S3UploadResult {
  fieldName: string;
  s3Url: string;
}

interface CustomRequest extends Request {
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

export async function uploadFilesToS3(
  req: CustomRequest
): Promise<S3UploadResult[]> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3 bucket name is not defined in environment variables.");
  }

  if (!req.files) {
    throw new Error("No files found in the request.");
  }

  const uploadPromises: Promise<S3UploadResult>[] = [];

  if (Array.isArray(req.files)) {
    console.log("files exist for upload");
    for (const singleFile of req.files) {
      const uploadPromise = uploadToS3(
        singleFile,
        bucketName,
        singleFile.fieldname
      );
      uploadPromises.push(uploadPromise);
    }
  } else if (typeof req.files === "object") {
    for (const fieldName in req.files) {
      const files = req.files[fieldName];

      if (Array.isArray(files)) {
        for (const singleFile of files) {
          const uploadPromise = uploadToS3(singleFile, bucketName, fieldName);
          uploadPromises.push(uploadPromise);
        }
      }
    }
  }

  return Promise.all(uploadPromises);
}

/**
 * Uploads a single file to S3.
 * @param file - The file to upload.
 * @param bucketName - The S3 bucket name.
 * @param fieldName - The field name of the file.
 * @returns A promise resolving to an S3UploadResult.
 */
async function uploadToS3(
  file: Express.Multer.File,
  bucketName: string,
  fieldName: string
): Promise<S3UploadResult> {
  const uploadParams = {
    Bucket: bucketName,
    Key: `${Date.now()}_${file.originalname}`, // Unique key for each file
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  console.log("uploadin to s3");

  const data = await s3.upload(uploadParams).promise();
  if (data) {
    console.log("uploaded to s3 successfully");
  }

  return {
    fieldName,
    s3Url: data.Location,
  };
}

/**
 * Deletes files from an S3 bucket based on a model instance and specified fields.
 * @param modelInstance The model instance containing fields with S3 keys.
 * @param fields An array of field names that contain S3 keys.
 */
export const deleteFilesFromS3 = async (
  modelInstance: any,
  fields: string[]
): Promise<void> => {
  const keysToDelete = fields
    .map((field) => modelInstance[field])
    .filter((key) => key);

  if (keysToDelete.length > 0) {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "", // Ensure bucket name is in env
      Delete: {
        Objects: keysToDelete.map((Key) => ({ Key })),
      },
    };

    await s3.deleteObjects(deleteParams).promise();
  }
};
