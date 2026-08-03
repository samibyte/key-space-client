"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImageFile, uploadImageUrl } from "@/services/upload.service";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  Link as LinkIcon,
  UploadCloud,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function PropertyImageUploader({
  value = [],
  onChange,
}: PropertyImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper helper to update images array
  const addImageUrl = (url: string) => {
    if (!url) return;
    const cleanUrls = value.filter(Boolean);
    if (!cleanUrls.includes(url)) {
      onChange([...cleanUrls, url]);
    }
  };

  const removeImage = (idxToRemove: number) => {
    const nextImages = value.filter((_, idx) => idx !== idxToRemove);
    onChange(nextImages.length > 0 ? nextImages : [""]);
  };

  // Drag-and-drop state & handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFilesUpload(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      await handleFilesUpload(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFilesUpload = async (files: File[]) => {
    setIsUploading(true);
    setErrorStatus(null);
    try {
      const uploadPromises = files.map(async (file) => {
        // Basic type validation
        if (!file.type.startsWith("image/")) {
          throw new Error(`File "${file.name}" is not an image.`);
        }
        // Limit to 5MB
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File "${file.name}" exceeds the 5MB size limit.`);
        }
        return await uploadImageFile(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const cleanUrls = value.filter(Boolean);
      const uniqueNewUrls = uploadedUrls.filter(
        (url) => !cleanUrls.includes(url),
      );

      onChange([...cleanUrls, ...uniqueNewUrls]);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Failed to upload one or more files.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUploading(true);
    setErrorStatus(null);

    try {
      // Direct call to API validation endpoint
      const validatedUrl = await uploadImageUrl(urlInput.trim());
      addImageUrl(validatedUrl);
      setUrlInput("");
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Invalid or unreachable image URL.");
    } finally {
      setIsUploading(false);
    }
  };

  const cleanImages = value.filter(Boolean);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {/* Tab Selectors */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => {
              setActiveTab("upload");
              setErrorStatus(null);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all",
              activeTab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <UploadCloud className="size-4" />
            Upload Files
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("url");
              setErrorStatus(null);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all",
              activeTab === "url"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <LinkIcon className="size-4" />
            Paste URL
          </button>
        </div>

        {/* Upload Content Area */}
        <div className="min-h-36">
          {activeTab === "upload" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 min-h-36 group",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30",
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
                  <Loader2 className="size-8 animate-spin text-primary" />
                  <span>Uploading local images to Cloudinary...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <UploadCloud className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="text-sm font-medium">
                    {isDragging
                      ? "Drop images here"
                      : "Drag & drop images here, or click to browse"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supports JPEG, PNG, WEBP, and GIF up to 5MB
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="https://example.com/property-image.jpg"
                  value={urlInput}
                  type="url"
                  disabled={isUploading}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground block pl-1">
                  Must start with http:// or https:// and link to an image file.
                </span>
              </div>
              <Button
                type="button"
                onClick={handleAddUrl}
                disabled={isUploading || !urlInput.trim()}
                className="gap-2 shrink-0"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Add URL
              </Button>
            </div>
          )}
        </div>

        {/* Error Msg */}
        {errorStatus && (
          <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg">
            {errorStatus}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground block">
            Selected Images ({cleanImages.length})
          </span>
          {cleanImages.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No images added yet.
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[40rem]">
          {cleanImages.length === 0 ? (
            <div className="col-span-2 rounded-lg border border-border/50 bg-muted/30 p-6 text-sm text-muted-foreground text-center">
              Added images will appear here.
            </div>
          ) : (
            cleanImages.map((url, idx) => {
              const isThumbnail = idx === 0;
              return (
                <div
                  key={url + idx}
                  className={cn(
                    "group relative aspect-video border rounded-lg overflow-hidden bg-muted transition-all select-none hover:shadow-md",
                    isThumbnail
                      ? "border-primary/60 ring-2 ring-primary/10"
                      : "border-border",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Property Image ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                  {isThumbnail && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded font-medium shadow-sm">
                      <Check className="size-3" />
                      Thumbnail
                    </div>
                  )}

                  {/* Hover Control overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="size-8 rounded-full shadow-md"
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
