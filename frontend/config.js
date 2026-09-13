export const backend_url = process.env.REACT_APP_API_URL || "http://localhost:4001";
export const currency = "$";

export function imageUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${backend_url}${path}`;
}
