const SIGNATURES: Array<{ mime: string; ext: string; bytes: number[]; offset?: number }> = [
  { mime: "image/png", ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/jpeg", ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/webp", ext: "webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // "RIFF"; WEBP checked separately below
];

export interface DetectedImage {
  mime: string;
  ext: string;
}

/**
 * Detects image type from magic bytes — never trust a client-supplied
 * filename or Content-Type. Rejects everything else, including SVG
 * (a script-injection vector) even if mislabelled as png/jpeg.
 * PROJECT.md §10.5.
 */
export function detectImageType(bytes: Uint8Array): DetectedImage | null {
  for (const sig of SIGNATURES) {
    if (bytes.length < sig.bytes.length) continue;
    const matches = sig.bytes.every((b, i) => bytes[i] === b);
    if (!matches) continue;

    if (sig.mime === "image/webp") {
      // Confirm the WEBP marker at bytes 8-11 to avoid false positives on
      // other RIFF-based formats (e.g. WAV, AVI).
      const webpMarker = [0x57, 0x45, 0x42, 0x50];
      if (bytes.length < 12 || !webpMarker.every((b, i) => bytes[8 + i] === b)) continue;
    }

    return { mime: sig.mime, ext: sig.ext };
  }
  return null;
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
