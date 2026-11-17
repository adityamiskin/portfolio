import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBlogReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Generates an optimized Cloudinary URL with automatic format and quality optimization
 * @param url - The original Cloudinary URL (with or without existing transformations)
 * @param options - Optimization options
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    crop?: "scale" | "limit" | "fill" | "fit";
  } = {},
): string {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  const { width, height, quality = "auto", format = "auto", crop = "limit" } = options;

  // Parse the Cloudinary URL
  // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
  const urlParts = url.split("/upload/");
  if (urlParts.length !== 2) {
    return url;
  }

  const baseUrl = urlParts[0];
  const afterUpload = urlParts[1];

  // Extract the public ID and version
  // Cloudinary URL structure: {transformations}/{version}/{public_id}
  // Version pattern: v{number}/
  const versionMatch = afterUpload.match(/\/v(\d+)\/(.+)/);

  const version = versionMatch ? `v${versionMatch[1]}/` : "";
  const publicId = versionMatch ? versionMatch[2] : afterUpload;

  // Build new transformation parameters (replacing any existing ones)
  const transformations: string[] = [];

  // Crop mode
  if (crop === "limit") {
    transformations.push("c_limit");
  } else if (crop === "scale") {
    transformations.push("c_scale");
  } else if (crop === "fill") {
    transformations.push("c_fill");
  } else if (crop === "fit") {
    transformations.push("c_fit");
  }

  // Width
  if (width) {
    transformations.push(`w_${width}`);
  }

  // Height
  if (height) {
    transformations.push(`h_${height}`);
  }

  // Format (f_auto for automatic format selection - AVIF/WebP)
  if (format === "auto") {
    transformations.push("f_auto");
  } else {
    transformations.push(`f_${format}`);
  }

  // Quality (q_auto for automatic quality optimization)
  if (quality === "auto") {
    transformations.push("q_auto");
  } else {
    transformations.push(`q_${quality}`);
  }

  // Construct the optimized URL
  const transformationString = transformations.join(",");
  const versionPart = version || "";
  return `${baseUrl}/upload/${transformationString}/${versionPart}${publicId}`;
}
