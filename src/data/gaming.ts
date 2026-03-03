export type GameItem = {
  slug: string;
  name: string;
  since?: number;
  logo?: string;
  accent?: string; // optionnel pour un glow
};

export const games: GameItem[] = [
  { slug: "valorant", name: "Valorant", since: 2022, logo: "/gaming/logos/valorant.png", accent: "#ff4655" },
  { slug: "dead-by-daylight", name: "Dead By Daylight", since: 2022, logo: "/gaming/logos/dbd.png", accent: "#b81a1a" },
  { slug: "clash-royale", name: "Clash Royale", since: 2016, logo: "/gaming/logos/clash-royale.png", accent: "#2b6cff" },
  { slug: "clash-of-clans", name: "Clash of Clans", since: 2015, logo: "/gaming/logos/clash-of-clans.png", accent: "#f6c243" },
  { slug: "overwatch", name: "Overwatch", since: 2018, logo: "/gaming/logos/overwatch.png", accent: "#f99e1a" },
  { slug: "minecraft", name: "Minecraft", since: 2013, logo: "/gaming/logos/minecraft.png", accent: "#45b649" },
  { slug: "gta-v-rp", name: "GTA V RP", since: 2019, logo: "/gaming/logos/gta-v-rp.png", accent: "#00d4ff" },
  { slug: "call-of-duty-black-ops-2", name: "Call of Duty: Black Ops 2", since: 2013, logo: "/gaming/logos/bo2.png", accent: "#a0a0a0" },
];