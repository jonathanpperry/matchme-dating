import { getMemberByUserId } from "@/app/actions/memberActions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { notFound } from "next/navigation";
import React from "react";

export default async function MemberDetailsPage({
  params,
}: {
  params: { userId: string };
}) {
  // Explicitly await the params object before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const member = await getMemberByUserId(resolvedParams.userId);

  if (!member) return notFound();

  return <CardInnerWrapper header="Profile" body={member.description} />;
}
