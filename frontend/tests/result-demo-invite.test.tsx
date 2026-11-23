import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ResultDesign } from "../src/app/design-result";
import { defaultProfile, type Attempt, type Material } from "../src/lib/types";

afterEach(cleanup);

const attempt = { id: "a", questions: [], answers: {} } as unknown as Attempt;
const material = { title: "Fotosintesis", sources: [] } as unknown as Material;

function show(onRegister?: () => void) {
  render(
    <ResultDesign
      attempt={attempt}
      material={material}
      recommendation={null}
      busy={false}
      displayName="Manda"
      preferences={defaultProfile.preferences}
      onBack={vi.fn()}
      onRecommend={vi.fn()}
      onRetry={vi.fn()}
      onPlanner={vi.fn()}
      onRest={vi.fn()}
      onSaveReview={vi.fn()}
      onSpeak={vi.fn()}
      onRegister={onRegister}
      notice={null}
    />,
  );
}

it("mengajak pengguna demo membuat akun dari halaman hasil", async () => {
  const onRegister = vi.fn();
  show(onRegister);
  expect(screen.getByText(/Ini masih mode demo/)).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Daftar gratis" }));
  expect(onRegister).toHaveBeenCalledOnce();
});

it("tidak menampilkan ajakan daftar untuk pengguna dengan akun", () => {
  show();
  expect(screen.queryByText(/Ini masih mode demo/)).toBeNull();
  expect(screen.queryByRole("button", { name: "Daftar gratis" })).toBeNull();
});
