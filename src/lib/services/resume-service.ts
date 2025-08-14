import { getSignedMediaUrl } from "@/lib/s3";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

// Types
export interface ResumeInfo {
  key: string;
  url: string;
  filename: string;
  uploadedAt: Date;
  size: number;
}

interface SerializedResumeInfo {
  key: string;
  url: string;
  filename: string;
  uploadedAt: string;
  size: number;
}

// Constants
const RESUME_METADATA_S3_KEY = "uploads/resumes/metadata.json";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// S3 Client - with robust error handling for Vercel
function createS3Client(): S3Client {
  const endpoint = process.env.ENDPOINT;
  const accessKeyId = process.env.ACCESS_KEY_ID;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;
  const bucketName = process.env.BUCKET_NAME;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      "Missing required S3 environment variables: ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME"
    );
  }

  return new S3Client({
    endpoint,
    region: "auto",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}

// Validation
class ResumeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumeValidationError";
  }
}

function validateResumeFile(file: File): void {
  if (!file.type.includes("pdf")) {
    throw new ResumeValidationError("Only PDF files are allowed for resumes");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ResumeValidationError("Resume file size must be less than 5MB");
  }
}

// S3 Operations
class S3Manager {
  static async saveMetadata(metadata: SerializedResumeInfo): Promise<void> {
    try {
      const s3Client = createS3Client();
      const metadataJson = JSON.stringify(metadata, null, 2);
      const buffer = Buffer.from(metadataJson, "utf8");

      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: RESUME_METADATA_S3_KEY,
        Body: buffer,
        ContentType: "application/json",
      });

      await s3Client.send(command);
    } catch (error) {
      console.error("Error saving resume metadata to S3:", error);
      throw new Error("Failed to save resume metadata to S3");
    }
  }

  static async loadMetadata(): Promise<ResumeInfo | null> {
    try {
      const s3Client = createS3Client();
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: RESUME_METADATA_S3_KEY,
      });

      const response = await s3Client.send(command);
      const data = await response.Body?.transformToString();

      if (!data) {
        return null;
      }

      const metadata: SerializedResumeInfo = JSON.parse(data);
      return {
        ...metadata,
        uploadedAt: new Date(metadata.uploadedAt),
      };
    } catch (error) {
      console.error("Error loading resume metadata from S3:", error);
      return null;
    }
  }

  static async uploadFile(file: File, key: string): Promise<void> {
    try {
      const s3Client = createS3Client();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const commandOptions: PutObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: file.size,
      };

      const command = new PutObjectCommand(commandOptions);
      await s3Client.send(command);
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file to S3");
    }
  }
}

// Utility Functions
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop() || "pdf";
  return `${timestamp}-${randomString}.${extension}`;
}

function buildResumeS3Key(fileName: string): string {
  return `uploads/resumes/${fileName}`;
}

function createResumeInfo(
  key: string,
  filename: string,
  size: number
): ResumeInfo {
  const endpoint = process.env.ENDPOINT!.replace(/\/$/, "");
  const bucket = process.env.BUCKET_NAME!;
  const url = `${endpoint}/${bucket}/${key}`;

  return {
    key,
    url,
    filename,
    uploadedAt: new Date(),
    size,
  };
}

// Main Service Functions
export async function uploadResume(file: File): Promise<ResumeInfo> {
  try {
    // Validate file
    validateResumeFile(file);

    // Generate unique filename and S3 key
    const fileName = generateUniqueFileName(file.name);
    const key = buildResumeS3Key(fileName);

    // Upload file to S3
    await S3Manager.uploadFile(file, key);

    // Create resume info
    const resumeInfo = createResumeInfo(key, fileName, file.size);

    // Save metadata to S3 only (no file system operations for Vercel compatibility)
    await S3Manager.saveMetadata({
      ...resumeInfo,
      uploadedAt: resumeInfo.uploadedAt.toISOString(),
    });

    return resumeInfo;
  } catch (error) {
    if (error instanceof ResumeValidationError) {
      throw error;
    }
    console.error("Error uploading resume:", error);
    throw new Error("Failed to upload resume");
  }
}

export async function getCurrentResume(): Promise<ResumeInfo | null> {
  try {
    // Load from S3 only (no file system operations for Vercel compatibility)
    return await S3Manager.loadMetadata();
  } catch (error) {
    console.error("Error getting current resume:", error);
    return null;
  }
}

export async function getResumeDownloadUrl(key: string): Promise<string> {
  try {
    return await getSignedMediaUrl(key, 3600); // 1 hour expiry
  } catch (error) {
    console.error("Error getting resume download URL:", error);
    throw new Error("Failed to generate download URL");
  }
}

export async function deleteResume(): Promise<void> {
  try {
    // TODO: Implement S3 deletion and metadata cleanup
    console.log("Resume deletion not yet implemented");
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw new Error("Failed to delete resume");
  }
}
