"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type Service = {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  pricing: string;
  ideal: string;
  order: number;
  published: boolean;
};

export default function EditServicesForm({
  services,
}: {
  services: Service[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, Service>>(
    Object.fromEntries(services.map((s) => [s.id, s])),
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(
    services[0]?.id ?? null,
  );

  const updateService = api.content.updateService.useMutation({
    onSuccess: (_, variables) => {
      setSaving(null);
      setSaved(variables.id);
      setTimeout(() => setSaved(null), 2000);
      router.refresh();
    },
    onError: () => setSaving(null),
  });

  function handleSave(id: string) {
    const s = form[id];
    if (!s) return;
    setSaving(id);
    updateService.mutate({
      id,
      title: s.title,
      tagline: s.tagline,
      description: s.description,
      deliverables: s.deliverables,
      pricing: s.pricing,
      ideal: s.ideal,
      published: s.published,
    });
  }

  function updateDeliverable(id: string, index: number, value: string) {
    setForm((prev) => {
      const service = prev[id];
      if (!service) return prev;
      const deliverables = [...service.deliverables];
      deliverables[index] = value;
      return { ...prev, [id]: { ...service, deliverables } };
    });
  }

  const inputClass =
    "w-full rounded-xl border border-cosmos-forest-light bg-cosmos-forest/30 px-4 py-3 text-base font-light text-white outline-none transition-colors focus:border-cosmos-teal";

  return (
    <div className="space-y-4">
      {services.map((service) => {
        const isExpanded = expanded === service.id;
        const s = form[service.id];
        if (!s) return null;

        return (
          <div
            key={service.id}
            className="border-cosmos-forest bg-cosmos-forest/20 rounded-2xl border"
          >
            {/* Header — click to expand */}
            <button
              onClick={() => setExpanded(isExpanded ? null : service.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-cosmos-teal text-2xl font-bold">
                  {service.number}
                </span>
                <span className="font-display text-xl font-semibold text-white">
                  {s.title}
                </span>
              </div>
              <span className="text-cosmos-sage">{isExpanded ? "▲" : "▼"}</span>
            </button>

            {/* Expanded form */}
            {isExpanded && (
              <div className="border-cosmos-forest space-y-4 border-t px-6 pt-4 pb-6">
                <div>
                  <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                    Title
                  </label>
                  <input
                    type="text"
                    value={s.title}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [service.id]: { ...s, title: e.target.value },
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={s.tagline}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [service.id]: { ...s, tagline: e.target.value },
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={s.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [service.id]: { ...s, description: e.target.value },
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                    Deliverables
                  </label>
                  <div className="space-y-2">
                    {s.deliverables.map((d, i) => (
                      <input
                        key={i}
                        type="text"
                        value={d}
                        onChange={(e) =>
                          updateDeliverable(service.id, i, e.target.value)
                        }
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                    Pricing
                  </label>
                  <input
                    type="text"
                    value={s.pricing}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [service.id]: { ...s, pricing: e.target.value },
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                    Ideal For
                  </label>
                  <textarea
                    rows={2}
                    value={s.ideal}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [service.id]: { ...s, ideal: e.target.value },
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-cosmos-sage text-sm font-medium">
                    Published
                  </label>
                  <input
                    type="checkbox"
                    checked={s.published}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [service.id]: { ...s, published: e.target.checked },
                      }))
                    }
                    className="accent-cosmos-teal h-4 w-4"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleSave(service.id)}
                    disabled={saving === service.id}
                    className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
                  >
                    {saving === service.id ? "Saving..." : "Save Changes"}
                  </button>
                  {saved === service.id && (
                    <span className="text-cosmos-teal text-sm">✓ Saved</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
