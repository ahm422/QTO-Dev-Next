import { customAlphabet } from "nanoid";

// Excludes visually-confusable characters (0/O, 1/I/l) so a publicId
// printed on a badge or QR code can be transcribed by hand without
// ambiguity. 12 chars keeps the id opaque/non-guessable — see #414
// ("publicId non-guessability is a load-bearing security control").
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
const PUBLIC_ID_LENGTH = 12;

const generate = customAlphabet(ALPHABET, PUBLIC_ID_LENGTH);

export function generatePublicId(): string {
  return generate();
}
