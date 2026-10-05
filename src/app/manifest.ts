import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Your Accountant Match",
    short_name: "Accountant Match",
    description: "Free accountant matching service connecting Australians with vetted local accountants.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#073265",
    lang: "en-AU",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
