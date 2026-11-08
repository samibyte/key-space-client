"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch without a setState-in-effect render cascade.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-lg text-muted-foreground"
        aria-label="Toggle theme"
      >
        <span className="size-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 rounded-lg text-primary hover:text-foreground hover:bg-muted/50 transition-all duration-200"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-4 text-orange-500" /> : <Moon className="size-4 text-primary" />}
    </Button>
  );
}
