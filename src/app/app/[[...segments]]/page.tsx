import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Workspace } from "@/components/workspace";
const roots = [
  "claims",
  "documents",
  "policies",
  "insights",
  "disputes",
  "actions",
  "help",
  "settings",
];
export default async function Page({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments = [] } = await params;
  const [root, id, tab] = segments;
  if (root && !roots.includes(root)) notFound();
  if (segments.length > 3) notFound();
  if (root === "claims" && id === "new" && tab) notFound();
  if ((root === "policies" || root === "settings") && tab) notFound();
  if (
    root === "claims" &&
    id &&
    id !== "new" &&
    !["CM-1024", "CM-1018", "CM-1003"].includes(id)
  )
    notFound();
  if (
    root === "claims" &&
    tab &&
    ![
      "journey",
      "evidence",
      "policy",
      "settlement",
      "messages",
      "dispute",
      "activity",
    ].includes(tab)
  )
    notFound();
  if (root === "policies" && id && id !== "EH-2026") notFound();
  if (
    root === "settings" &&
    id &&
    !["profile", "privacy", "security", "notifications", "data"].includes(id)
  )
    notFound();
  if (!["claims", "policies", "settings"].includes(root) && segments.length > 1)
    notFound();
  return (
    <Suspense fallback={<p role="status">Opening this view…</p>}>
      <Workspace segments={segments} />
    </Suspense>
  );
}
