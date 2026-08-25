// Guarda o access token apenas em memória (variável de módulo), nunca em
// localStorage/sessionStorage — o refresh token vive só no cookie httpOnly
// emitido pelo backend, inacessível a JavaScript.
let currentAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return currentAccessToken;
}

export function setAccessToken(token: string | null): void {
  currentAccessToken = token;
}
