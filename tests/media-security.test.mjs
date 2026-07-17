import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeImage } from "../lib/media-security.ts";

function ascii(value) { return [...value].map((character) => character.charCodeAt(0)); }

test("JPEG sanitizer removes EXIF-style APP1 data", () => {
  const input = Uint8Array.from([0xff,0xd8, 0xff,0xe1,0x00,0x06, 1,2,3,4, 0xff,0xdb,0x00,0x04, 5,6, 0xff,0xda,0x00,0x02, 7,8,9]);
  const output = new Uint8Array(sanitizeImage(input.buffer, "image/jpeg"));
  assert.deepEqual([...output.slice(0, 2)], [0xff, 0xd8]);
  assert.equal(output.includes(1), false);
  assert.equal(output.includes(5), true);
});

test("PNG sanitizer removes textual and EXIF chunks", () => {
  const signature = [137,80,78,71,13,10,26,10];
  const text = [0,0,0,3, ...ascii("tEXt"), 1,2,3, 0,0,0,0];
  const iend = [0,0,0,0, ...ascii("IEND"), 0,0,0,0];
  const output = new Uint8Array(sanitizeImage(Uint8Array.from([...signature, ...text, ...iend]).buffer, "image/png"));
  assert.equal(String.fromCharCode(...output).includes("tEXt"), false);
  assert.equal(String.fromCharCode(...output).includes("IEND"), true);
});

test("WebP sanitizer rejects invalid image structure", () => {
  assert.equal(sanitizeImage(Uint8Array.from(ascii("not-an-image")).buffer, "image/webp"), null);
  assert.equal(sanitizeImage(Uint8Array.from(ascii("not-an-image")).buffer, "image/jpeg"), null);
});
