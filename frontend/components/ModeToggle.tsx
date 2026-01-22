"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant={"outline"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-full rounded-md flex items-center gap-2"
    >
      {theme === "dark" ? (
        <div className="flex items-center gap-2">
          <Sun size={20} />
          <p>Light</p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Moon size={20} />
          <p>Dark</p>
        </div>
      )}
    </Button>
  );
}
