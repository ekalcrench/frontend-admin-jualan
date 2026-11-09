export function getImageDataUrl(base64?: string | null): string | undefined {
  if (!base64) {
    return undefined;
  }

  return base64.startsWith("data:")
    ? base64
    : `data:image/png;base64,${base64}`;
}
