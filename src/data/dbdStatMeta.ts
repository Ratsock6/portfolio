export type DbdCategory = "survivor" | "killer" | "progression" | "other";

export type DbdStatMeta = {
  label: string;
  category: DbdCategory;
  order?: number; // pour choisir l’ordre d’affichage
  format?: "int" | "floatPct" | "bloodpoints";
};

export const dbdStatMeta: Record<string, DbdStatMeta> = {
  // Survivor (core)
  DBD_Escape: { label: "Évasions", category: "survivor", order: 10, format: "int" },
  DBD_EscapeKO: { label: "Évasions au sol", category: "survivor", order: 11, format: "int" },
  DBD_EscapeThroughHatch: { label: "Évasions par la trappe", category: "survivor", order: 12, format: "int" },
  DBD_HookedAndEscape: { label: "Évasions après crochet", category: "survivor", order: 13, format: "int" },

  DBD_SkillCheckSuccess: { label: "Skill checks réussis", category: "survivor", order: 20, format: "int" },
  DBD_UnhookOrHeal: { label: "Décrochages / soins", category: "survivor", order: 21, format: "int" },
  DBD_UnhookOrHeal_PostExit: { label: "Décrochages/soins (après sortie)", category: "survivor", order: 22, format: "int" },

  // Attention: ceux-là sont des "pct_float" (cumul d'actions en % / points)
  DBD_GeneratorPct_float: { label: "Réparation générateurs (cumul)", category: "survivor", order: 30, format: "floatPct" },
  DBD_HealPct_float: { label: "Soins (cumul)", category: "survivor", order: 31, format: "floatPct" },

  // Killer (core)
  DBD_SacrificedCampers: { label: "Survivants sacrifiés", category: "killer", order: 10, format: "int" },
  DBD_KilledCampers: { label: "Survivants tués", category: "killer", order: 11, format: "int" },
  DBD_HitNearHook: { label: "Coups près d’un crochet", category: "killer", order: 20, format: "int" },
  DBD_UncloakAttack: { label: "Attaques après décloak", category: "killer", order: 21, format: "int" },

  // Exemples killer spécifiques (tu en as quelques-uns)
  DBD_ChainsawHit: { label: "Coups à la tronçonneuse", category: "killer", order: 30, format: "int" },
  DBD_SlasherTierIncrement: { label: "Montées de tier (pouvoir)", category: "killer", order: 31, format: "int" },

  // Progression
  DBD_BloodwebPoints: { label: "Bloodpoints dépensés", category: "progression", order: 10, format: "bloodpoints" },
  DBD_BloodwebMaxPrestigeLevel: { label: "Prestige max", category: "progression", order: 11, format: "int" },
  DBD_BloodwebMaxLevel: { label: "Niveau Bloodweb max", category: "progression", order: 12, format: "int" },
  DBD_BloodwebPerkMaxLevel: { label: "Niveau perk max (Bloodweb)", category: "progression", order: 13, format: "int" },
  DBD_MaxBloodwebPointsOneCategory: { label: "Max BP en une catégorie", category: "progression", order: 14, format: "bloodpoints" },

  // Un exemple “survivor inventory”
  DBD_CamperKeepUltraRare: { label: "Objets ultra rares conservés", category: "survivor", order: 40, format: "int" },
  DBD_BurnOffering_UltraRare: { label: "Offrandes ultra rares brûlées", category: "survivor", order: 41, format: "int" },
};