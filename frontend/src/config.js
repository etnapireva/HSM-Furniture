const LIVE_API = "https://hsm-furniture.onrender.com";
const envApi = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const isLocalHost = typeof window !== "undefined"
  && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

export const backend_url = (!envApi || (envApi.includes("localhost") && !isLocalHost))
  ? (isLocalHost ? "http://localhost:4001" : LIVE_API)
  : envApi;
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
