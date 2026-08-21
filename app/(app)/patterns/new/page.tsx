import { NewPatternForm } from "@/components/domain/new-pattern-form";

export default function NewPatternPage() {
  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">New pattern</h1>
      <p className="mt-1 text-text-secondary">
        Write it yourself, or generate a starting draft with AI — always editable, always
        labelled.
      </p>
      <div className="mt-6">
        <NewPatternForm aiEnabled={aiEnabled} />
      </div>
    </div>
  );
}
