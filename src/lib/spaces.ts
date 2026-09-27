import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * PRIVATE medical-report storage (DigitalOcean Spaces). Separate bucket and credentials from
 * Cloudinary; objects are never public-read. All access is through short-lived signed URLs.
 */
const configured = Boolean(process.env.SPACES_KEY && process.env.SPACES_SECRET && process.env.SPACES_BUCKET);

let client: S3Client | null = null;
function s3() {
  if (!configured) throw new Error("Private report storage is not configured (SPACES_* env vars).");
  client ??= new S3Client({
    endpoint: process.env.SPACES_ENDPOINT,
    region: process.env.SPACES_REGION ?? "us-east-1",
    credentials: { accessKeyId: process.env.SPACES_KEY!, secretAccessKey: process.env.SPACES_SECRET! },
    forcePathStyle: false,
  });
  return client;
}

export const privateStorageConfigured = () => configured;
const Bucket = () => process.env.SPACES_BUCKET!;

/** Presigned PUT, valid for `expiresIn` seconds, locked to one key and content type. */
export async function signedUploadUrl(key: string, contentType: string, expiresIn = 600) {
  if (!configured) return { url: `/api/uploads/dev-sink?key=${encodeURIComponent(key)}`, devSink: true };
  const url = await getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: Bucket(), Key: key, ContentType: contentType, ACL: "private", ServerSideEncryption: "AES256" }),
    { expiresIn },
  );
  return { url, devSink: false };
}

/** Presigned GET for staff viewing a report (physician role only — check before calling). */
export async function signedDownloadUrl(key: string, expiresIn = 300) {
  if (!configured) return null;
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: Bucket(), Key: key }), { expiresIn });
}

export async function objectExists(key: string) {
  if (!configured) return true;
  try {
    const head = await s3().send(new HeadObjectCommand({ Bucket: Bucket(), Key: key }));
    return { size: head.ContentLength ?? 0 };
  } catch {
    return false;
  }
}

export async function deleteObject(key: string) {
  if (!configured) return;
  await s3().send(new DeleteObjectCommand({ Bucket: Bucket(), Key: key }));
}
