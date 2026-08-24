import { SignInForm } from "./sign-in-form";

// Read DEMO_LOGIN_* per request — this page must not be prerendered at
// build time (CI has no demo env, so a static build would bake it off).
export const dynamic = "force-dynamic";

export default function SignInPage() {
  // Demo mode is opt-in via env. Credentials live in server env only —
  // they reach the client solely through these props when enabled.
  const demoEnabled = process.env.DEMO_LOGIN_ENABLED === "true";
  const demoEmail = process.env.DEMO_LOGIN_EMAIL;
  const demoPassword = process.env.DEMO_LOGIN_PASSWORD;

  return (
    <SignInForm
      demoEmail={demoEnabled ? demoEmail : undefined}
      demoPassword={demoEnabled ? demoPassword : undefined}
    />
  );
}
