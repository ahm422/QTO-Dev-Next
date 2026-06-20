// Precomputed bcrypt hash (rounds=12) for timing-safe user-not-found path.
// Prevents email enumeration via response-time differences.
export const DUMMY_BCRYPT_HASH =
  "$2b$12$6rZTONnEc3eTzvK9u0JsquIsUuDrcmFk5UeGQN4AuHzhCgMjAzbpq";
