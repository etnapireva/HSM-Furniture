export const backend_url = process.env.REACT_APP_API_URL || "http://localhost:4001";
export const currency = "€";

export function cartKey(productOrId) {
  if (productOrId && typeof productOrId === "object") {
    return String(productOrId.id ?? productOrId._id);
  }
  return String(productOrId);
}

export function imageUrl(image) {
  const first = Array.isArray(image) ? image[0] : image;
  if (!first) return "";
  if (/^https?:\/\//i.test(first)) return first;
  const path = String(first).startsWith("/") ? first : `/${first}`;
  return `${backend_url}${path}`;
}

export function imageCandidates(image) {
  const list = (Array.isArray(image) ? image : [image]).filter(Boolean);
  return [...new Set(list.map((item) => imageUrl(item)).filter(Boolean))];
}
