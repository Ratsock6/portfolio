export type DbdStat = {
  label: string;
  category: "survivor" | "killer";
};

export const dbdStats: Record<string, DbdStat> = {

  /* SURVIVOR */

  DBD_Escape: { label: "Évasions", category: "survivor" },
  DBD_EscapeKO: { label: "Évasions par la trappe", category: "survivor" },
  DBD_GeneratorRepair: { label: "Générateurs réparés", category: "survivor" },
  DBD_Heal: { label: "Soins effectués", category: "survivor" },
  DBD_HealOther: { label: "Alliés soignés", category: "survivor" },
  DBD_Unhook: { label: "Décrochages", category: "survivor" },
  DBD_UnhookSafe: { label: "Décrochages sécurisés", category: "survivor" },
  DBD_PalletStun: { label: "Étourdissements palette", category: "survivor" },
  DBD_SkillCheckSuccess: { label: "Skill checks réussis", category: "survivor" },
  DBD_SkillCheckGreat: { label: "Great skill checks", category: "survivor" },

  /* KILLER */

  DBD_KillerSacrifice: { label: "Survivants sacrifiés", category: "killer" },
  DBD_KillerKill: { label: "Mori effectués", category: "killer" },
  DBD_KillerHook: { label: "Accrochages", category: "killer" },
  DBD_KillerDownSurvivor: { label: "Survivants mis à terre", category: "killer" },
  DBD_KillerHit: { label: "Coups infligés", category: "killer" },
  DBD_CamperGeneratorKick: { label: "Générateurs endommagés", category: "killer" },
  DBD_TrapSet: { label: "Pièges posés", category: "killer" },
  DBD_BearTrapCatch: { label: "Survivants piégés", category: "killer" },
};