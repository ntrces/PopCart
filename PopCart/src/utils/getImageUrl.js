// Build a usable image URL from the stored `album_cover_img` value.
// Supports comma-separated lists and relative paths (e.g., "uploads/...").
export default function getImageUrl(album_cover_img) {
  if (!album_cover_img) return null;
  const imgPath = String(album_cover_img).split(',')[0].trim();
  if (!imgPath) return null;
  return imgPath.startsWith('http') ? imgPath : `http://localhost/${imgPath}`;
}
