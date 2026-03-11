import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve("./data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export function readJson(filename, fallback) {
  const file = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

export function writeJson(filename, data) {
  const file = path.join(DATA_DIR, filename);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}