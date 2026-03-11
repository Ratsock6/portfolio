import { readJson, writeJson } from "../cache/cacheStore.js";
import { config } from "../config.js";
import {
    getPlayerSummaries,
    getOwnedGames,
    getUserStatsForGame,
    getSchemaForGame,
    getPlayerAchievements,
} from "./steam.service.js";

const DBD_APPID = 381210;

const CACHE_FILE = "dbd-cache.json";
const DEFAULT = {
    updatedAt: null,
    profile: null,
    playtime: null,
    stats: [],
    achievements: {
        unlocked: [],
        total: null,
        unlockedCount: null,
        percent: null,
    },
    schema: {
        achievements: [],
    },
};

let cache = readJson(CACHE_FILE, DEFAULT);
let isUpdating = false;

function normalizePlaytime(ownedGamesJson) {
    const games = ownedGamesJson?.response?.games ?? [];
    const dbd = games.find((g) => Number(g.appid) === DBD_APPID) ?? null;
    if (!dbd) return null;

    const minutes = dbd.playtime_forever ?? 0;
    return {
        appid: DBD_APPID,
        name: dbd.name ?? "Dead by Daylight",
        minutes,
        hours: Math.round((minutes / 60) * 10) / 10,
        icon: dbd.img_icon_url
            ? `https://media.steampowered.com/steamcommunity/public/images/apps/${DBD_APPID}/${dbd.img_icon_url}.jpg`
            : null,
        logo: dbd.img_logo_url
            ? `https://media.steampowered.com/steamcommunity/public/images/apps/${DBD_APPID}/${dbd.img_logo_url}.jpg`
            : null,
    };
}

function normalizeUserStats(userStatsJson) {
    const gs = userStatsJson?.playerstats ?? null;
    if (!gs) return { stats: [], achievements: [] };

    const stats = (gs.stats ?? []).map((s) => ({
        name: s.name,
        value: s.value,
    }));

    const achievements = (gs.achievements ?? []).map((a) => ({
        apiName: a.name,
        achieved: a.achieved === 1,
        unlockTime: a.unlocktime ?? null,
    }));

    return { stats, achievements };
}

function mergeAchievementsWithSchema(unlocked, schemaAchievements) {
    const schemaMap = new Map(
        (schemaAchievements ?? []).map((a) => [a.name, a])
    );

    return unlocked.map((u) => {
        const s = schemaMap.get(u.apiName) ?? null;
        return {
            apiName: u.apiName,
            achieved: u.achieved,
            unlockTime: u.unlockTime,
            displayName: s?.displayName ?? null,
            description: s?.description ?? null,
            icon: s?.icon ?? null,
            icongray: s?.icongray ?? null,
            hidden: s?.hidden ?? 0,
        };
    });
}

export function getDBDData() {
    return cache;
}

export async function updateDBDCache() {
    if (isUpdating) return;
    isUpdating = true;

    try {
        if (!config.steam.apiKey || !config.steam.steamId) {
            throw new Error("STEAM_API_KEY ou STEAM_ID manquant");
        }

        // Base (fiables)
        const [profile, owned, schema] = await Promise.all([
            getPlayerSummaries(),
            getOwnedGames(),
            getSchemaForGame(DBD_APPID),
        ]);

        const playtime = normalizePlaytime(owned);

        // Schema achievements (metadata: noms, descriptions, icônes)
        const schemaAchievements =
            schema?.game?.availableGameStats?.achievements ?? [];

        // Achievements joueur (fallback fiable)
        let playerAchievements = [];
        try {
            const pa = await getPlayerAchievements(DBD_APPID);
            playerAchievements = pa?.playerstats?.achievements ?? [];
        } catch (e) {
            console.error("⚠️ DBD GetPlayerAchievements failed:", e.message);
            playerAchievements = [];
        }

        // UserStats (optionnel, peut fail 400 {} -> on ignore)
        let stats = [];
        try {
            const userStats = await getUserStatsForGame(DBD_APPID);
            const normalized = normalizeUserStats(userStats);
            stats = normalized?.stats ?? [];
        } catch (e) {
            console.error("⚠️ DBD GetUserStatsForGame failed (ignored):", e.message);
            stats = [];
        }

        // Merge achievements (player) + schema (noms/icones)
        const schemaMap = new Map(schemaAchievements.map((a) => [a.name, a]));

        const mergedAchievements = playerAchievements.map((a) => {
            const s = schemaMap.get(a.apiname) ?? null;
            return {
                apiName: a.apiname,
                achieved: a.achieved === 1,
                unlockTime: a.unlocktime ?? null,
                displayName: s?.displayName ?? null,
                description: s?.description ?? null,
                icon: s?.icon ?? null,
                icongray: s?.icongray ?? null,
                hidden: s?.hidden ?? 0,
            };
        });

        const unlocked = mergedAchievements.filter((x) => x.achieved);
        const total = schemaAchievements.length || mergedAchievements.length || null;
        const unlockedCount = unlocked.length;
        const percent = total ? Math.round((unlockedCount / total) * 1000) / 10 : null;

        cache = {
            updatedAt: new Date().toISOString(),
            profile: profile
                ? {
                    steamid: profile.steamid,
                    personaname: profile.personaname,
                    avatar: profile.avatarfull ?? profile.avatar ?? null,
                    profileurl: profile.profileurl ?? null,
                    personastate: profile.personastate ?? null,
                }
                : null,
            playtime,
            stats,
            achievements: {
                unlocked: unlocked.sort((a, b) => (b.unlockTime ?? 0) - (a.unlockTime ?? 0)),
                total,
                unlockedCount,
                percent,
            },
            schema: {
                achievements: schemaAchievements,
            },
        };

        writeJson(CACHE_FILE, cache);
        console.log(`✅ DBD cache updated at ${cache.updatedAt}`);
    } catch (e) {
        console.error("❌ DBD update failed:", e.message);
    } finally {
        isUpdating = false;
    }
}