import AWS from 'aws-sdk';

const endpoint = process.env.S3_ENDPOINT;
const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
  ...(endpoint ? { endpoint, s3ForcePathStyle: forcePathStyle } : {})
});

export const s3 = new AWS.S3();
export const S3_BUCKET = process.env.AWS_BUCKET_NAME || 'chatsphere-uploads';

