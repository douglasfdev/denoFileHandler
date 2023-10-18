import { CreateBucketRequest } from "https://deno.land/x/aws_api@v0.8.1/services/s3/structs.ts";
import { env } from "./env.config.ts"

export const awsS3Config = {
  awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
  awsSecretKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
};
