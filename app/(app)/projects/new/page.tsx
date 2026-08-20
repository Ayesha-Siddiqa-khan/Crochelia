import { NewProjectForm } from "@/components/domain/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl text-text-primary">New project</h1>
      <p className="mt-1 text-text-secondary">
        Describe what you&rsquo;re making — Crochelia calculates the squares for you.
      </p>
      <div className="mt-6">
        <NewProjectForm />
      </div>
    </div>
  );
}
