import { dbdStatLabels } from "../data/dbdStatLabels";

export function getDBDStatName(key: string) {
  return dbdStatLabels[key] ?? key.replace(/_/g, " ");
}