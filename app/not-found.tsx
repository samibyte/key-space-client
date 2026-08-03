import Link from "next/link";
import { ArrowLeft, Search, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
      {/* Premium Decorative background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute -bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-2xl flex flex-col items-center space-y-10 z-10 select-none text-center">
        {/* Floating Nest / 404 Illustration */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background circles */}
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
          <div className="absolute inset-8 rounded-full border border-dashed border-primary/20 animate-[spin_60s_linear_infinite]" />

          {/* Main Visual */}
          <div className="relative animate-[bounce_4s_ease-in-out_infinite] [animation-duration:5s] flex flex-col items-center">
            {/* Elegant Nest-like House SVG */}
            <svg
              className="w-36 h-36 text-primary filter drop-shadow-[0_8px_16px_rgba(0,80,64,0.15)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              {/* Nest Base (twigs style/half oval) */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.5c0 3.5 4 5.5 9 5.5s9-2 9-5.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15.5c2 1 4 1.5 7 1.5s5-.5 7-1.5"
              />
              {/* House/Nest Structure */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3L4 9v9.5c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5V9l-8-6z"
              />
              {/* Empty Sign/Hole */}
              <circle
                cx="12"
                cy="11"
                r="2.5"
                className="stroke-primary/40 fill-background"
              />
              {/* Little branches/leaves */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h-2m19.5 0h-2M12 21v-2"
              />
            </svg>

            {/* Glowing 404 Badging */}
            <div className="absolute -bottom-2 bg-background border border-primary/20 shadow-lg px-4 py-1 rounded-full text-sm font-extrabold tracking-widest text-primary">
              404
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="flex flex-col items-center space-y-4 max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            This Nest is Empty
          </h1>
          <p className="text-base text-muted-foreground/90 leading-relaxed">
            The page you are looking for has taken flight or never existed.
            Let&apos;s find you a listing that is currently on the market.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg text-left mt-2">
          <Link
            href="/properties"
            className="group flex items-start p-4 bg-card/60 backdrop-blur-sm border border-border/80 hover:border-primary/30 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
          >
            <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mr-4">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                Explore Properties
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Find available listings & rooms
              </p>
            </div>
          </Link>

          <Link
            href="/auth/login"
            className="group flex items-start p-4 bg-card/60 backdrop-blur-sm border border-border/80 hover:border-primary/30 rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
          >
            <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mr-4">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Nest Portal</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Access leases, rent & requests
              </p>
            </div>
          </Link>
        </div>

        {/* Primary Home Action */}
        <div className="pt-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 px-7 rounded-xl font-bold bg-primary hover:bg-primary/95 text-primary-foreground flex items-center gap-1.5 shadow-md shadow-primary/10 active:scale-[0.98] transition-all",
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safety
          </Link>
        </div>
      </div>
    </div>
  );
}
