import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { Card } from "@/components/surfaces/card";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="text-sm font-medium text-text-brand">Get in touch</p>
      <h1 className="mt-2 font-display text-4xl text-text-primary">Contact</h1>
      <p className="mt-4 text-text-secondary">
        Questions, feedback, or something not working the way it should? Reach out directly.
      </p>

      <Card className="mt-8 flex flex-col gap-4 p-6">
        <a
          href="mailto:proeditorpakistanifeeling@gmail.com"
          className="flex items-center gap-3 text-text-primary hover:text-text-brand"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-pink-50 text-text-brand">
            <Mail className="size-5" />
          </span>
          proeditorpakistanifeeling@gmail.com
        </a>
        <a
          href="tel:+923066987888"
          className="flex items-center gap-3 text-text-primary hover:text-text-brand"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-pink-50 text-text-brand">
            <Phone className="size-5" />
          </span>
          0306 6987888
        </a>
      </Card>
    </div>
  );
}
