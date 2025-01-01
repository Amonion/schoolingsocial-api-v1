// import AWS from "aws-sdk";
// import { Request } from "express";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// interface S3UploadResult {
//   fieldName: string;
//   s3Url: string;
// }

// interface CustomRequest extends Request {
//   files?:
//     | { [fieldname: string]: Express.Multer.File[] }
//     | Express.Multer.File[];
// }

// export async function uploadFilesToS3(
//   req: CustomRequest,
//   fileFieldNames: string[]
// ): Promise<S3UploadResult[]> {
//   const bucketName = process.env.AWS_S3_BUCKET_NAME;

//   if (!bucketName) {
//     throw new Error("S3 bucket name is not defined in environment variables.");
//   }

//   const uploadPromises: Promise<S3UploadResult>[] = [];

//   for (const fieldName of fileFieldNames) {
//     let files: Express.Multer.File[] | undefined;

//     if (Array.isArray(req.files)) {
//       files = req.files as Express.Multer.File[];
//     } else if (req.files && typeof req.files === "object") {
//       files = req.files[fieldName];
//     }

//     if (!files) {
//       throw new Error(
//         `File with field name ${fieldName} not found in the request.`
//       );
//     }

//     for (const singleFile of files) {
//       const uploadParams = {
//         Bucket: bucketName,
//         Key: `${Date.now()}_${singleFile.originalname}`, // Unique key for each file
//         Body: singleFile.buffer,
//         ContentType: singleFile.mimetype,
//       };

//       const uploadPromise = s3
//         .upload(uploadParams)
//         .promise()
//         .then((data) => ({
//           fieldName,
//           s3Url: data.Location,
//         }));

//       uploadPromises.push(uploadPromise);
//     }
//   }

//   return Promise.all(uploadPromises);
// }

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
    // If files are in an array format
    for (const singleFile of req.files) {
      const uploadPromise = uploadToS3(
        singleFile,
        bucketName,
        singleFile.fieldname
      );
      uploadPromises.push(uploadPromise);
    }
  } else if (typeof req.files === "object") {
    // If files are in an object format
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

  const data = await s3.upload(uploadParams).promise();

  return {
    fieldName,
    s3Url: data.Location,
  };
}
