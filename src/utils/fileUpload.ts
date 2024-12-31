import { Request, Response } from "express";
import AWS from "aws-sdk";
import path from "path";
import formidable from "formidable";
import fs from "fs";

import { handleError } from "../utils/errorHandler";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || "schooling-bucket1";
  const form = formidable({ multiples: true });

  const setParams = (
    bucket: string,
    key: string,
    buffer: Buffer,
    type: string
  ) => {
    return {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: type,
      ACL: "public-read",
    };
  };

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        handleError(res, undefined, undefined, err);
        // return reject({ error: "Error parsing form data", details: err });
      }

      try {
        for (const key in files) {
          const fileOrFiles = files[key] as formidable.File | formidable.File[];

          if (Array.isArray(fileOrFiles)) {
            for (const file of fileOrFiles) {
              if (file && file.filepath && file.mimetype) {
                const buffer = fs.readFileSync(file.filepath);
                const folder = determineFolder(file.mimetype, res);
                const fileName = `${Date.now()}_${path.basename(
                  file.originalFilename || ""
                )}`;

                const mimeType = file.mimetype ?? "application/octet-stream";

                const params = setParams(
                  bucketName,
                  `${folder}/${fileName}`,
                  buffer,
                  mimeType
                );

                const { Location } = await s3.upload(params).promise();

                if (!Array.isArray((fields as any)[key])) {
                  (fields as any)[key] = [];
                }
                (fields as any)[key].push(Location);
              }
            }
          } else if (
            fileOrFiles &&
            (fileOrFiles as formidable.File).filepath &&
            (fileOrFiles as formidable.File).mimetype
          ) {
            const file = fileOrFiles as formidable.File;
            const buffer = fs.readFileSync(file.filepath);
            const folder = determineFolder(String(file.mimetype), res);
            const fileName = `${Date.now()}_${path.basename(
              file.originalFilename || ""
            )}`;

            const mimeType = file.mimetype ?? "application/octet-stream";

            const params = setParams(
              bucketName,
              `${folder}/${fileName}`,
              buffer,
              mimeType
            );

            const { Location } = await s3.upload(params).promise();
            (fields as any)[key] = Location;
          }
        }

        resolve({ fields, files });
        req.body = { ...req.body, ...fields };
        next();
      } catch (error) {
        handleError(res, undefined, undefined, error);
        // reject({ error: "Error uploading file", details: error });
      }
    });
  });
};

const determineFolder = (mimeType: string, res: Response) => {
  if (mimeType.startsWith("image/")) {
    return "images";
  } else if (mimeType.startsWith("video/")) {
    return "videos";
  } else if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType.startsWith("application/vnd.openxmlformats-officedocument")
  ) {
    return "documents";
  }
  const error = new Error("Unsupported file type");
  handleError(res, undefined, undefined, error);
};
