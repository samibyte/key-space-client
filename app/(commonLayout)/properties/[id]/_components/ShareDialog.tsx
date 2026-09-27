"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export default function ShareDialog({
  isOpen,
  onClose,
  propertyTitle,
}: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      const isShareSupported = typeof navigator !== "undefined" && typeof navigator.share === "function";
      
      const timer = setTimeout(() => {
        setShareUrl(currentUrl);
        setCanShare(isShareSupported);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          text: `Check out this property: ${propertyTitle}`,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch {
        // user cancelled or share failed
      }
    }
  };

  const shareText = `Check out this amazing property I found on KeySpace: ${propertyTitle}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialShares = [
    {
      name: "WhatsApp",
      color: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20",
      icon: (
        <svg className="size-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 border border-[#1877F2]/20",
      icon: (
        <svg className="size-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X / Twitter",
      color: "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-foreground/10",
      icon: (
        <svg className="size-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "Email",
      color: "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted-hover border border-border/80",
      icon: <Mail className="size-4.5" />,
      url: `mailto:?subject=${encodeURIComponent(propertyTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton className="sm:max-w-md w-full gap-5 border border-border/50 bg-card p-6">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-bold text-foreground">
            Share this property
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
            Copy the link below or choose a platform to share this property.
          </DialogDescription>
        </DialogHeader>

        {/* Copy Link Row */}
        <div className="flex items-center gap-2 mt-1">
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full h-10 px-3 pr-8 rounded-xl bg-muted/60 text-xs border border-border/40 text-muted-foreground focus:outline-none focus:border-primary/50 text-ellipsis whitespace-nowrap overflow-hidden transition-colors"
            />
          </div>
          <Button
            size="sm"
            onClick={handleCopy}
            className="h-10 rounded-xl px-4 text-xs font-semibold shrink-0 gap-1.5"
            variant={copied ? "outline" : "default"}
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </div>

        {/* Social Options Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {socialShares.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 ${platform.color}`}
            >
              <div className="flex items-center justify-center size-9 rounded-full bg-black/5 dark:bg-white/10 shrink-0">
                {platform.icon}
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {platform.name}
              </span>
            </a>
          ))}
        </div>

        {/* System share if available */}
        {canShare && (
          <div className="border-t border-border/40 pt-4 mt-2">
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="w-full h-10 rounded-xl text-xs gap-2 border-border/60 hover:bg-muted/40 transition-colors"
            >
              <Share2 className="size-3.5 text-muted-foreground" />
              More share options
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
