import bucket from "./s3/files";
import rateLimit from "./dynamodb/rate-limits";

const { files, cloudfront } = bucket();
const rateLimits = rateLimit();

export const bucketName = files.bucket;
export const cloudfrontUrl = cloudfront.domainName;
export const rateLimitsName = rateLimits.name;
