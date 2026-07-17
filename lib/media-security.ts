const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

function join(parts: Uint8Array[]) {
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) { output.set(part, offset); offset += part.byteLength; }
  return output;
}

function jpeg(bytes: Uint8Array) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const output = [bytes.slice(0, 2)];
  let offset = 2;
  while (offset < bytes.length) {
    const start = offset;
    if (bytes[offset] !== 0xff) return null;
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xda) { output.push(bytes.slice(start)); return join(output); }
    if (marker === 0xd9) { output.push(bytes.slice(start, offset)); return join(output); }
    if (marker >= 0xd0 && marker <= 0xd7) { output.push(bytes.slice(start, offset)); continue; }
    if (offset + 2 > bytes.length) return null;
    const length = (bytes[offset] << 8) | bytes[offset + 1];
    if (length < 2 || offset + length > bytes.length) return null;
    const end = offset + length;
    if (![0xe1, 0xed, 0xfe].includes(marker)) output.push(bytes.slice(start, end));
    offset = end;
  }
  return null;
}

function png(bytes: Uint8Array) {
  if (!pngSignature.every((value, index) => bytes[index] === value)) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const output = [bytes.slice(0, 8)];
  const privateChunks = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"]);
  let offset = 8;
  let hasIend = false;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) return null;
    const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
    if (!privateChunks.has(type)) output.push(bytes.slice(offset, end));
    offset = end;
    if (type === "IEND") { hasIend = true; break; }
  }
  return hasIend ? join(output) : null;
}

function webp(bytes: Uint8Array) {
  const ascii = (start: number, length: number) => String.fromCharCode(...bytes.slice(start, start + length));
  if (ascii(0, 4) !== "RIFF" || ascii(8, 4) !== "WEBP") return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const parts = [bytes.slice(0, 12)];
  let offset = 12;
  let imageChunk = false;
  while (offset + 8 <= bytes.length) {
    const type = ascii(offset, 4);
    const length = view.getUint32(offset + 4, true);
    const end = offset + 8 + length + (length % 2);
    if (end > bytes.length) return null;
    if (!["EXIF", "XMP "].includes(type)) {
      const chunk = bytes.slice(offset, end);
      if (type === "VP8X" && length >= 1) chunk[8] &= ~0x0c;
      parts.push(chunk);
    }
    if (["VP8 ", "VP8L", "ANMF"].includes(type)) imageChunk = true;
    offset = end;
  }
  if (!imageChunk) return null;
  const output = join(parts);
  new DataView(output.buffer).setUint32(4, output.byteLength - 8, true);
  return output;
}

export function sanitizeImage(buffer: ArrayBuffer, mime: string) {
  const bytes = new Uint8Array(buffer);
  const sanitized = mime === "image/jpeg" ? jpeg(bytes) : mime === "image/png" ? png(bytes) : mime === "image/webp" ? webp(bytes) : null;
  if (!sanitized) return null;
  return sanitized.buffer.slice(sanitized.byteOffset, sanitized.byteOffset + sanitized.byteLength) as ArrayBuffer;
}
