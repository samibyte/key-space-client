import { clientPost, clientPatch } from "@/lib/axios/apiClient";

export interface UploadResponse {
  url: string;
  publicId?: string;
}

/**
 * Upload a local image file to the server which streams it directly to Cloudinary.
 * @param file The file to upload.
 * @returns The Cloudinary secure_url returned by the server.
 */
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await clientPost<UploadResponse>("/upload/image", formData);
  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to upload image file");
  }

  return response.data.url;
}

/**
 * Pass through an image URL to the server for validation.
 * @param url The external URL to pass.
 * @returns The validated image URL.
 */
export async function uploadImageUrl(url: string): Promise<string> {
  const response = await clientPost<UploadResponse>("/upload/image-url", { url });
  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to validate/accept external image URL");
  }

  return response.data.url;
}

/**
 * Upload a user avatar file to the server and update profile.
 * @param file The avatar image file.
 * @returns The new avatar secure_url.
 */
export async function uploadUserAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await clientPatch<{ avatar: string }>("/auth/me/avatar", formData);
  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to upload/update avatar");
  }

  return response.data.avatar;
}
