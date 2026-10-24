import { notFound } from "next/navigation";
import { Account, Onboarding } from "@/components/account";
export default async function Page({
  params,
}: {
  params: Promise<{ account: string }>;
}) {
  const { account } = await params;
  if (account === "onboarding") return <Onboarding />;
  if (
    !["sign-in", "sign-up", "forgot-password", "verify-email"].includes(account)
  )
    notFound();
  return <Account mode={account} />;
}
