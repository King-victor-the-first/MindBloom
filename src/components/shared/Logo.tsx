import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(32, 32)">
            <path d="M0 -30 C 15 -15, 15 15, 0 30 C -15 15, -15 -15, 0 -30 Z" fill="#2E4C6D" transform="rotate(180)"/>
            <path d="M0 -30 C 15 -15, 15 15, 0 30 C -15 15, -15 -15, 0 -30 Z" fill="#6E9A96" transform="rotate(240)"/>
            <path d="M0 -30 C 15 -15, 15 15, 0 30 C -15 15, -15 -15, 0 -30 Z" fill="#2E4C6D" transform="rotate(300)"/>
            <path d="M0 -30 C 15 -15, 15 15, 0 30 C -15 15, -15 -15, 0 -30 Z" fill="#F3F8F2" transform="rotate(0)"/>
            <path d="M0 -30 C 15 -15, 15 15, 0 30 C -15 15, -15 -15, 0 -30 Z" fill="#3D7E80" transform="rotate(60)"/>
            <path d="M0 -30 C 15 -15, 15 15, 0 30 C -15 15, -15 -15, 0 -30 Z" fill="#6E9A96" transform="rotate(120)"/>
            
            <circle cx="0" cy="-20" r="3" fill="#2E4C6D" transform="rotate(180)"/>
            <circle cx="0" cy="-20" r="3" fill="#6E9A96" transform="rotate(240)"/>
            <circle cx="0" cy="-20" r="3" fill="#2E4C6D" transform="rotate(300)"/>
            <circle cx="0" cy="-20" r="3" fill="#F3F8F2" transform="rotate(0)"/>
            <circle cx="0" cy="-20" r="3" fill="#3D7E80" transform="rotate(60)"/>
            <circle cx="0" cy="-20" r="3" fill="#6E9A96" transform="rotate(120)"/>
        </g>
      </svg>

      <span className="font-headline text-xl font-bold text-primary">MindBloom</span>
    </div>
  );
}
