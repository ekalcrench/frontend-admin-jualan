export function getImageDataUrl(base64?: string | null): string | undefined {
  if (!base64) {
    return undefined;
  }

  return base64.startsWith("data:")
    ? base64
    : `data:image/png;base64,${base64}`;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read the selected logo"));
        return;
      }

      const base64 = reader.result.split(",")[1];
      if (!base64) {
        reject(new Error("Could not encode the selected logo"));
        return;
      }

      resolve(base64);
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read the selected logo"));
    reader.readAsDataURL(file);
  });
}
