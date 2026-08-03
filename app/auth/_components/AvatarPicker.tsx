import { X, Upload, User, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form-nextjs";
import { uploadImageFile } from "@/services/upload.service";

export const AvatarPicker = ({ field }: { field: AnyFieldApi }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(field.state.value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation: Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorText("File exceeds the 5MB size limit.");
      return;
    }

    try {
      setIsUploading(true);
      setErrorText(null);
      
      const uploadedUrl = await uploadImageFile(file);
      
      setPreview(uploadedUrl);
      field.handleChange(uploadedUrl);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    field.handleChange("");
    setErrorText(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        Profile photo{" "}
        <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "size-16 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden shrink-0",
            "transition-colors hover:border-primary/50",
          )}
        >
          {preview ? (
            <img src={preview} alt="Avatar preview" className="size-full object-cover" />
          ) : (
            <User className="size-6 text-muted-foreground" aria-hidden />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleFileChange}
            aria-label="Upload profile photo"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-3.5" aria-hidden />
            )}
            {isUploading ? "Uploading..." : preview ? "Change photo" : "Upload photo"}
          </Button>

          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-destructive"
              onClick={handleClear}
              disabled={isUploading}
            >
              <X className="size-3.5" aria-hidden />
              Remove
            </Button>
          )}

          <p className="text-[11px] text-muted-foreground leading-tight">
            JPG, PNG or WebP · max 5 MB
          </p>

          {errorText && (
            <p className="text-[11px] text-rose-500 font-medium leading-tight">
              {errorText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};