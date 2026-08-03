import Logo from "@/components/ui/logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
      {/* Decorative background glow circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center space-y-8 select-none">
        {/* Animated logo wrapper */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Pulsating outer rings */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping [animation-duration:3s]" />
          <div className="absolute inset-2 rounded-full border border-primary/20 animate-pulse [animation-duration:2s]" />
          <div className="absolute -inset-4 rounded-full border border-dashed border-primary/10 animate-[spin_40s_linear_infinite]" />

          {/* Logo container with gentle scaling animation */}
          <div className="relative z-10 w-24 h-24 bg-card p-4 rounded-full shadow-2xl border border-primary/10 flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
            <Logo className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,80,64,0.15)]" />
          </div>
        </div>

        {/* Dynamic, premium text indicators */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <h2 className="text-xl font-semibold tracking-wide text-foreground">
            Rent Nest
          </h2>
          <div className="flex items-center space-x-1.5 text-sm font-medium text-muted-foreground/85">
            <span>Staging your next home</span>
            <span className="flex space-x-1 items-center mt-0.5">
              <span className="w-1 h-1 bg-primary/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-primary/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-primary/80 rounded-full animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
