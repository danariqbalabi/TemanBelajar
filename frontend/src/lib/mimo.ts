export type MimoMood = "wave" | "reading" | "cheer";
export type MimoReaction = { mood: MimoMood; message: string };

export function reactMimo(reaction: MimoReaction) {
  window.dispatchEvent(
    new CustomEvent<MimoReaction>("temanbelajar:mimo", { detail: reaction }),
  );
}
