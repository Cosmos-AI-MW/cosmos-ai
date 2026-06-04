"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const labels: Record<string, string> = {
  hero_tagline: "Hero Tagline",
  story_paragraph_1: "Story Paragraph 1",
  story_paragraph_2: "Story Paragraph 2",
  story_paragraph_3: "Story Paragraph 3",
  vision: "Vision",
  mission: "Mission",
  team_description: "Team Description",
};

export default function EditAboutForm({
  content,
}: {
  content: Record<string, string>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(content);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const updateAbout = api.content.updateAboutContent.useMutation({
    onSuccess: (_, variables) => {
      setSaving(null);
      setSaved(variables.key);
      setTimeout(() => setSaved(null), 2000);
      router.refresh();
    },
    onError: () => setSaving(null),
  });

  function handleSave(key: string) {
    setSaving(key);
    updateAbout.mutate({ key, value: form[key] ?? "" });
  }

  return (
    <div className="space-y-6">
      {Object.entries(labels).map(([key, label]) => (
        <div
          key={key}
          className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6"
        >
          <label className="text-cosmos-teal mb-2 block text-sm font-medium tracking-widest uppercase">
            {label}
          </label>
          <textarea
            rows={key === "hero_tagline" ? 2 : 4}
            value={form[key] ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className="border-cosmos-forest-light bg-cosmos-forest/30 focus:border-cosmos-teal placeholder:text-cosmos-sage/40 w-full rounded-xl border px-4 py-3 text-base font-light text-white transition-colors outline-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => handleSave(key)}
              disabled={saving === key}
              className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {saving === key ? "Saving..." : "Save"}
            </button>
            {saved === key && (
              <span className="text-cosmos-teal text-sm">✓ Saved</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
