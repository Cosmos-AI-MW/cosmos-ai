"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function EditPromptForm({
  name,
  initialContent,
  updatedAt,
}: {
  name: string;
  initialContent: string;
  updatedAt: Date | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);

  const updatePrompt = api.content.updatePrompt.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    },
  });

  function handleSave() {
    updatePrompt.mutate({ name, content });
  }

  return (
    <div>
      {updatedAt && (
        <p className="text-cosmos-sage/40 mb-3 text-xs font-light">
          Last updated:{" "}
          {new Date(updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          at{" "}
          {new Date(updatedAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        className="border-cosmos-forest bg-cosmos-night/50 text-cosmos-sage focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 font-mono text-sm font-light transition-colors outline-none"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-cosmos-sage/40 text-xs font-light">
          {content.length} characters
        </p>
        <button
          onClick={handleSave}
          disabled={updatePrompt.isPending || content === initialContent}
          className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updatePrompt.isPending
            ? "Saving..."
            : saved
              ? "✓ Saved"
              : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
