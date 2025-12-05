import { S3Client } from "@aws-sdk/client-s3";
import { appConfig } from "./env";

const s3Client = new S3Client({
  region: appConfig.aws.region,
  credentials: {
    accessKeyId: appConfig.aws.accessKeyId || "",
    secretAccessKey: appConfig.aws.secretAccessKey || "",
  },
});

export { s3Client };
