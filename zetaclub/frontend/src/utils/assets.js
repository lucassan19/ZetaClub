const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const ASSETS_URL = API_URL.replace("/api", "");

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return null;

  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  return `${ASSETS_URL}${assetPath}`;
};
