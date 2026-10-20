import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { ApiError, handle, ok, requireAdmin } from "@/lib/server/api";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

/** Detects the real image type from the first bytes (the browser-supplied type can be faked). */
function sniff(b: Buffer): "jpg" | "png" | "webp" | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length > 12 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.length > 12 && b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

/**
 * Admin photo upload. Goes to Cloudinary when CLOUDINARY_* is configured (production); otherwise the file is saved under
 * /public/uploads so local development works without any account.
 */
export const POST = handle(async (req: Request) => {
  await requireAdmin();
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "Choose a photo to upload");
  if (file.size > MAX_BYTES) throw new ApiError(400, `This photo is ${(file.size / 1048576).toFixed(1)} MB. The maximum is 8 MB.`);

  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type) throw new ApiError(400, "Only JPEG, PNG or WEBP photos are allowed.");

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
    const url = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "jewelsbyricha/products", resource_type: "image" }, (err, res) => (err || !res ? reject(err ?? new Error("upload failed")) : resolve(res.secure_url)))
        .end(buf);
    }).catch(() => {
      throw new ApiError(502, "The image could not be uploaded. Please try again.");
    });
    return ok({ url }, { status: 201 });
  }

  if (process.env.NODE_ENV === "production") throw new ApiError(503, "Image storage is not configured (Cloudinary).");
  const name = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}.${type}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return ok({ url: `/uploads/${name}` }, { status: 201 });
});
