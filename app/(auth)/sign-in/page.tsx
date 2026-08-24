import { SignInForm } from "./sign-in-form";

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
