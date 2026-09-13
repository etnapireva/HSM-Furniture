export const backend_url = process.env.REACT_APP_API_URL || "http://localhost:4001";
export const currency = "€";

export function cartKey(productOrId) {
  if (productOrId && typeof productOrId === "object") {
    return String(productOrId.id ?? productOrId._id);
  }
  return String(productOrId);
}

export function imageUrl(image) {
  return imageCandidates(image)[0] || "";
}

export function imageCandidates(image) {
  const list = (Array.isArray(image) ? image : [image]).filter(Boolean);
  const urls = [];
  for (const item of list) {
    if (/^https?:\/\//i.test(String(item))) {
      urls.push(item);
      continue;
    }
    const imagePath = String(item).startsWith("/") ? String(item) : `/${item}`;
    urls.push(imagePath);
    urls.push(`${backend_url}${imagePath}`);
  }
  return [...new Set(urls.filter(Boolean))];
}
