import { s3, S3_BUCKET } from '../config/s3';

export const uploadBuffer = async (key: string, buffer: Buffer, mimeType: string) => {
  await s3
    .putObject({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read'
    })
    .promise();

  return `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
};

