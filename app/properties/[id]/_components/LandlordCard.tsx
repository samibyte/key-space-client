import Image from "next/image";
import { Mail, Phone, User } from "lucide-react";
import type { Landlord } from "@/types/property.type";

interface LandlordCardProps {
  landlord: Landlord;
}

export default function LandlordCard({ landlord }: LandlordCardProps) {
  const { name, email, phone, avatar } = landlord;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-3">Listed by</h2>
      <div className="rounded-2xl border border-primary/20 bg-card shadow-sm overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/70 via-primary/40 to-transparent" />

        <div className="p-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="size-14 rounded-2xl overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center ring-2 ring-primary/20">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              ) : (
                <span className="text-primary text-lg font-bold">{initials}</span>
              )}
            </div>

            {/* Name + role */}
            <div>
              <p className="font-bold text-foreground text-base">{name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <User className="size-3" />
                Property Landlord
              </p>
            </div>
          </div>

          {/* Contact details */}
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <span className="size-8 rounded-lg bg-muted/60 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Mail className="size-3.5 text-primary/70" />
              </span>
              <span className="truncate">{email}</span>
            </a>

            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <span className="size-8 rounded-lg bg-muted/60 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="size-3.5 text-primary/70" />
                </span>
                <span>{phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
