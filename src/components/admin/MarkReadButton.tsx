"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function MarkReadButton({
  id,
  read,
}: {
  id: string;
  read: boolean;
}) {
  const router = useRouter();

  const markRead = api.contact.markRead.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  if (read) return null;

  return (
    <button
      onClick={() => markRead.mutate({ id })}
      disabled={markRead.isPending}
      className="border-cosmos-teal text-cosmos-teal hover:bg-cosmos-teal rounded-full border px-4 py-1.5 text-xs font-medium transition-colors hover:text-white disabled:opacity-50"
    >
      {markRead.isPending ? "Marking..." : "Mark as Read"}
    </button>
  );
}
