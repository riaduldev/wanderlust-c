// Seeded destination image URLs point at fake hosts, so the next/image
// optimizer answers 500 — cards fall back to these local images on error.
// Lives in its own module (not destinations-api.ts) so client components
// never pull the server-side jose/jwt code into the browser bundle.
export const FALLBACK_DESTINATION_IMAGES = [
  "/images/destinations/image1.png",
  "/images/destinations/image2.png",
  "/images/destinations/image3.png",
  "/images/destinations/image4.png",
  "/images/destinations/image5.png",
  "/images/destinations/image6.png",
] as const;
