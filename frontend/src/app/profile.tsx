"use client";
import Image from "next/image";
import { SettingsDesign } from "./design-settings";
import { Landing } from "./design-landing";
import { AccountDesign } from "./design-account";
import { OnboardingDesign } from "./design-onboarding";
import type { Session } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import type { Run } from "./page";
export function Mimo() {
  return (
    <Image
      src="/design/mimo.png"
      width={1024}
      height={1024}
      className="mimo-svg"
      alt="Mimo, bunglon ramah yang duduk di atas buku"
    />
  );
}
export function Account({
  landing,
  onContinue,
  onDemo,
  onBack,
  run,
  busy,
  error,
}: {
  landing: boolean;
  onContinue: () => void;
  onDemo?: () => void;
  onBack: () => void;
  run: Run;
  busy: boolean;
  error: string;
}) {
  if (!landing)
    return (
      <AccountDesign
        onDemo={onDemo}
        onBack={onBack}
        run={run}
        busy={busy}
        error={error}
      />
    );
  return <Landing onContinue={onContinue} error={error} />;
}
export function Onboarding(props: {
  initial: Profile;
  onBack?: () => void;
  onSave: (p: Profile) => void;
  busy: boolean;
  error: string;
}) {
  return <OnboardingDesign {...props} />;
}
export function Settings(props: {
  profile: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  account: Session;
  signOut: () => void;
  onBack: () => void;
}) {
  return <SettingsDesign {...props} />;
}
