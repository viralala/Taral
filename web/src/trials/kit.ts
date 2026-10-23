/**
 * Everything a trial needs to look and sound like the rest of Taral. Import from "@/trials/kit".
 */
export { default as Timer } from "@/components/game/Timer"; // <Timer limit={20} active onTimeout={fn} />
export { default as Stamp } from "@/components/game/Stamp"; // <Stamp pass={true} />  big PASS / FAIL
export { default as CaptchaBot } from "@/components/game/CaptchaBot"; // <CaptchaBot mood="smug" size={78} />
export { sfx } from "@/lib/audio"; // sfx("pass" | "fail" | "click" | "tick" | "whoosh" | "chime")
export { usePlayer } from "@/lib/player"; // const { player } = usePlayer(); player.hero / player.love
export { saveRun } from "@/lib/supabase"; // optional: leaderboard row (the story already does this)
export type { TrialComponent, TrialProps, TrialResult } from "./types";

/** Theme class names (defined in globals.css). */
export const CARD = "paper-card"; // the cream paper panel
export const BTN = "btn-paint"; // main lime button
export const BTN_GHOST = "btn-ghost"; // quiet secondary button
export const TITLE = "marker"; // big hand-drawn heading (never use leading-none on it)
export const LABEL = "hand"; // small uppercase handwritten label
