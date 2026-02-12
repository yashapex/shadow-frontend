import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
  className?: string;
}

export function Logo({ size = "md", clickable = true, className = "" }: LogoProps) {
  const sizeMap = {
    sm: { box: "w-8 h-8", text: "text-lg", brand: "text-xl" },
    md: { box: "w-10 h-10", text: "text-xl", brand: "text-2xl" },
    lg: { box: "w-14 h-14", text: "text-2xl", brand: "text-3xl" },
  };

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeMap[size].box} rounded-lg bg-gradient-to-br from-accent to-destructive flex items-center justify-center shadow-glow transition-transform duration-300 hover:scale-105`}
        >
          <span className={`font-display font-bold text-foreground ${sizeMap[size].text}`}>
            S
          </span>
        </div>
        <div className="absolute inset-0 rounded-lg bg-accent/30 blur-lg -z-10" />
      </div>
      <span className={`font-display font-bold tracking-wider text-foreground ${sizeMap[size].brand}`}>
        SHADOW
      </span>
    </div>
  );

  if (!clickable) return content;
  return <Link to="/" className="inline-flex">{content}</Link>;
}
