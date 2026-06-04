"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type Value = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export default function EditValuesForm({ values }: { values: Value[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, Value>>(
    Object.fromEntries(values.map((v) => [v.id, v])),
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const updateValue = api.content.updateValue.useMutation({
    onSuccess: (_, variables) => {
      setSaving(null);
      setSaved(variables.id);
      setTimeout(() => setSaved(null), 2000);
      router.refresh();
    },
    onError: () => setSaving(null),
  });

  function handleSave(id: string) {
    const v = form[id];
    if (!v) return;
    setSaving(id);
    updateValue.mutate({ id, title: v.title, description: v.description });
  }

  return (
    <div className="space-y-6">
      {values.map((value) => (
        <div
          key={value.id}
          className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="text-cosmos-teal text-2xl font-bold">
              {value.order}
            </span>
            <input
              type="text"
              value={form[value.id]?.title ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [value.id]: { ...prev[value.id]!, title: e.target.value },
                }))
              }
              className="border-cosmos-forest-light bg-cosmos-forest/30 focus:border-cosmos-teal flex-1 rounded-xl border px-4 py-2 text-base font-semibold text-white transition-colors outline-none"
            />
          </div>
          <textarea
            rows={3}
            value={form[value.id]?.description ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [value.id]: {
                  ...prev[value.id]!,
                  description: e.target.value,
                },
              }))
            }
            className="border-cosmos-forest-light bg-cosmos-forest/30 focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 text-base font-light text-white transition-colors outline-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => handleSave(value.id)}
              disabled={saving === value.id}
              className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {saving === value.id ? "Saving..." : "Save"}
            </button>
            {saved === value.id && (
              <span className="text-cosmos-teal text-sm">✓ Saved</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
