import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  signatureVersion: "v4"
});

export async function getPresignedPutUrl(params: {
  vendorId: string;
  productSlug?: string;
  fileName: string;
  type: "image" | "video";
}) {
  const bucket = process.env.S3_BUCKET as string;
  const base = params.type === "video" ? "videos" : "images";
  const key = `dumbdee-vendor-media/${params.vendorId}/${base}/${params.productSlug || "misc"}/${params.fileName}`;
  const url = await s3.getSignedUrlPromise("putObject", {
    Bucket: bucket,
    Key: key,
    Expires: 60 * 5,
    ContentType: params.type === "video" ? "video/mp4" : "image/jpeg",
    ACL: "private"
  });
  return { url, key };
}
