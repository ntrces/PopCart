// Build a usable image URL from the stored `album_cover_img` value.
// Supports comma-separated lists and relative paths (e.g., "uploads/...").
export default function getImageUrl(album_cover_img) {
  if (!album_cover_img) return null;
  const imgPath = String(album_cover_img).split(',')[0].trim();
  if (!imgPath) return null;
  if (imgPath.startsWith('http')) return imgPath;
  // Use dynamic hostname (works with localhost, 127.0.0.1, or network IPs like 192.168.x.x)
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  return `${protocol}//${host}/${imgPath}`;
}
