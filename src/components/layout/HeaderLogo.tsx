// The header logo: the same logo on every page.
import Image from "next/image";
import { logo } from "@/config/site.config";

export default function HeaderLogo({ className }: { className: string }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      priority
      sizes="(min-width:1280px) 22vw, (min-width:768px) 300px, 210px"
      className={className}
    />
  );
}
