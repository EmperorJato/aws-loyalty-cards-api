import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import parseMultipart from "parse-multipart";

const client = new S3Client({ region: "ap-northeast-1" });

const bucketName = process.env.LOYALTY_CARD_BUCKET;

export const handler = async (event) => {
  const boundary = parseMultipart.getBoundary(event.headers["content-type"]);
  const files = parseMultipart.Parse(
    Buffer.from(event.body, "base64"),
    boundary
  );

  const [{ filename, data }] = files;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: data,
  });

  try{
    const response = await client.send(command);
    console.log(response)
  } catch(e) {
    console.log(e)
  }


};
