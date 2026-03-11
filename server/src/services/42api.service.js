import { readJson, writeJson } from "../cache/cacheStore.js";
import { config } from "../config.js";

const CACHE_FILE = "42api-cache.json";
const DEFAULT = { updatedAt: null, profile: null };
let cache = readJson(CACHE_FILE, DEFAULT);

let isUpdating = false;

async function getToken() {
  const response = await fetch("https://api.intra.42.fr/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config._42.uid,
      client_secret: config._42.secret
    })
  });

  const data = await response.json();
  return data.access_token;
}

async function getUser(login) {
  const token = await getToken();

  const response = await fetch(`https://api.intra.42.fr/v2/users/${login}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response;
}



async function fetchJson(res, url) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${url} ${text}`);
  }
  return res.json();
}

export function get42Data() {
  return cache;
}

export async function update42apiCache() {
    if (isUpdating) return;
    isUpdating = true;

    try {
      const { login } = config._42.login ? { login: config._42.login } : null;
      if (!login) throw new Error("LOGIN manquant");
      const profile =  await getUser(login);
      const profileData = await fetchJson(profile, `https://api.intra.42.fr/v2/users/${login}`);
      cache = { updatedAt: new Date(), profile: profileData };
      writeJson(CACHE_FILE, cache);
  } catch (e) {
    console.error("❌ 42API update failed:", e.message);
  } finally {
    isUpdating = false;
  }
}
