// Dynamic API URL builder for network compatibility
// Automatically uses the current host instead of hardcoded localhost

const protocol = window.location.protocol; // http: or https:
const host = window.location.hostname;      // 192.168.43.161, localhost, etc.
const apiBase = `${protocol}//${host}/PopCart1/PopCart/PopCart/src/popcart-api`;

export const apiUrl = (endpoint) => `${apiBase}/${endpoint}`;
