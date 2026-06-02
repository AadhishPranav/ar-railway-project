import { useState } from "react";
import { Train } from "lucide-react";
import type { RailwaySign } from "@/data/railwaySigns";
import { cn } from "@/lib/utils";

type SignImageProps = {
  sign: RailwaySign;
  className?: string;
  imgClassName?: string;
  preferPhoto?: boolean;
};

export function SignImage({
  sign,
  className,
  imgClassName,
  preferPhoto = true,
}: SignImageProps) {
  const [src, setSrc] = useState(
    preferPhoto && sign.imagePhotoUrl ? sign.imagePhotoUrl : sign.imageUrl
  );
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-white/5",
          className
        )}
        aria-hidden
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-xl border-2 text-2xl font-black"
          style={{
            backgroundColor: sign.color + "22",
            borderColor: sign.color + "55",
            color: sign.color,
          }}
        >
          {sign.name.charAt(0)}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={sign.imageAlt}
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full object-cover", imgClassName)}
      onError={() => {
        if (src !== sign.imageUrl) {
          setSrc(sign.imageUrl);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

export function SignImageBadge({ sign }: { sign: RailwaySign }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
      <Train className="h-3 w-3" />
      {sign.category}
    </span>
  );
}
