import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 15.5C14.46 16.54 13.04 17 12 17C10.96 17 9.54 16.54 8.5 15.5C7.46 14.46 7 13.04 7 12C7 10.19 7.82 8.5 9.17 7.17C9.87 6.47 10.92 6 12 6C13.08 6 14.13 6.47 14.83 7.17C16.18 8.5 17 10.19 17 12C17 13.04 16.54 14.46 15.5 15.5Z"
          fill="currentColor"
        />
        <path
          d="M12 6C10.92 6 9.87 6.47 9.17 7.17C7.82 8.5 7 10.19 7 12C7 13.04 7.46 14.46 8.5 15.5C9.54 16.54 10.96 17 12 17V6Z"
          fill="url(#gradient)"
        />
        <defs>
          <linearGradient
            id="gradient"
            x1="12"
            y1="6"
            x2="12"
            y2="17"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="1" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-headline text-xl font-bold">MindBloom</span>
    </div>
  );
}
