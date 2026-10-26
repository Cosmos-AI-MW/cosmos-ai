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

const emptyService = {
  title: "",
  tagline: "",
  description: "",
  deliverables: ["", "", "", ""],
  pricing: "",
  ideal: "",
  published: true,
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
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState(emptyService);
  const [deleting, setDeleting] = useState<string | null>(null);

  const updateService = api.content.updateService.useMutation({
    onSuccess: (_, variables) => {
      setSaving(null);
      setSaved(variables.id);
      setTimeout(() => setSaved(null), 2000);
      router.refresh();
    },
    onError: () => setSaving(null),
  });

  const createService = api.content.createService.useMutation({
    onSuccess: () => {
      setShowAdd(false);
      setNewService(emptyService);
      router.refresh();
    },
  });

  const deleteService = api.content.deleteService.useMutation({
    onSuccess: () => {
      setDeleting(null);
      router.refresh();
    },
    onError: () => setDeleting(null),
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
      deliverables: s.deliverables.filter((d) => d.trim() !== ""),
      pricing: s.pricing,
      ideal: s.ideal,
      published: s.published,
    });
  }

  function handleCreate() {
    createService.mutate({
      ...newService,
      deliverables: newService.deliverables.filter((d) => d.trim() !== ""),
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeleting(id);
    deleteService.mutate({ id });
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

  function updateNewDeliverable(index: number, value: string) {
    setNewService((prev) => {
      const deliverables = [...prev.deliverables];
      deliverables[index] = value;
      return { ...prev, deliverables };
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
                    <button
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          [service.id]: {
                            ...s,
                            deliverables: [...s.deliverables, ""],
                          },
                        }))
                      }
                      className="text-cosmos-teal text-sm hover:underline"
                    >
                      + Add deliverable
                    </button>
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
                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={deleting === service.id}
                    className="rounded-full border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {deleting === service.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add New Service */}
      {showAdd ? (
        <div className="border-cosmos-teal bg-cosmos-forest/20 rounded-2xl border p-6">
          <h3 className="font-display mb-4 text-lg font-semibold text-white">
            New Service
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                Title
              </label>
              <input
                type="text"
                value={newService.title}
                onChange={(e) =>
                  setNewService((prev) => ({ ...prev, title: e.target.value }))
                }
                className={inputClass}
                placeholder="e.g. AI for Agriculture"
              />
            </div>
            <div>
              <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                Tagline
              </label>
              <input
                type="text"
                value={newService.tagline}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    tagline: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Short description"
              />
            </div>
            <div>
              <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                Description
              </label>
              <textarea
                rows={4}
                value={newService.description}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Full description"
              />
            </div>
            <div>
              <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                Deliverables
              </label>
              <div className="space-y-2">
                {newService.deliverables.map((d, i) => (
                  <input
                    key={i}
                    type="text"
                    value={d}
                    onChange={(e) => updateNewDeliverable(i, e.target.value)}
                    className={inputClass}
                    placeholder={`Deliverable ${i + 1}`}
                  />
                ))}
                <button
                  onClick={() =>
                    setNewService((prev) => ({
                      ...prev,
                      deliverables: [...prev.deliverables, ""],
                    }))
                  }
                  className="text-cosmos-teal text-sm hover:underline"
                >
                  + Add deliverable
                </button>
              </div>
            </div>
            <div>
              <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                Pricing
              </label>
              <input
                type="text"
                value={newService.pricing}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    pricing: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder="e.g. Starting from MWK 50,000"
              />
            </div>
            <div>
              <label className="text-cosmos-teal mb-2 block text-xs font-medium tracking-widest uppercase">
                Ideal For
              </label>
              <textarea
                rows={2}
                value={newService.ideal}
                onChange={(e) =>
                  setNewService((prev) => ({ ...prev, ideal: e.target.value }))
                }
                className={inputClass}
                placeholder="Who is this service for?"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-cosmos-sage text-sm font-medium">
                Published
              </label>
              <input
                type="checkbox"
                checked={newService.published}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    published: e.target.checked,
                  }))
                }
                className="accent-cosmos-teal h-4 w-4"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={createService.isPending || !newService.title}
                className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {createService.isPending ? "Creating..." : "Create Service"}
              </button>
              <button
                onClick={() => {
                  setShowAdd(false);
                  setNewService(emptyService);
                }}
                className="text-cosmos-sage text-sm transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="border-cosmos-forest-light text-cosmos-sage hover:border-cosmos-teal w-full rounded-2xl border border-dashed py-4 text-sm font-medium transition-colors hover:text-white"
        >
          + Add New Service
        </button>
      )}
    </div>
  );
}
